const fetchItem = require('../api/internal/item').fetch;
const shippingOptions = require('../static/shippingOptions');
const paymentMethods = require('../static/paymentMethods');
const internalCustomer = require('../api/internal/customer');

async function build(data) {
    let fulfillment = data.fulfillmentStartInstructions[0];
    let shipping = fulfillment.shippingStep;
    let shipTo = shipping.shipTo;
    let address = shipTo.contactAddress;

    let payload = {
        platform: {
            site: 'eBay',
            orderId: data.orderId,
            customerId: data.buyer.username,
        },
        totals: {
            item: parseFloat(data.pricingSummary.priceSubtotal.value),
            shipping: parseFloat(data.pricingSummary.deliveryCost.value),
            total: parseFloat(data.pricingSummary.total.value),
        }
    };

    if (data.buyerCheckoutNotes) {
        payload.notes = {
            text: data.buyerCheckoutNotes,
            type: 'customer',
        };
    }

    if (data.pricingSummary.tax) {
        payload.totals.tax = parseFloat(data.pricingSummary.tax.value);
    }

    if (data.orderPaymentStatus === process.env.EBAY_PAID_ORDER_PAYMENT_STATUS) {
        payload.payment = handlePayments(data);
        payload.shipping = handleShipping(data);
    }

    payload.customer = await buildCustomer(shipTo, address);

    console.dir(payload, { depth: null });

    return payload;
}

async function buildCustomer(shipTo, address) {
    const existing = await internalCustomer.fetchByEmail(shipTo.email);

    const orderAddress = {
        company: shipTo.companyName,
        line1: address.addressLine1,
        line2: address.addressLine2,
        city: address.city,
        state: address.stateOrProvince,
        zip: address.postalCode,
        country: address.countryCode,
    };

    if (!existing) {
        const customer = await internalCustomer.create({
            fullName: shipTo.fullName,
            address: [ orderAddress ],
            phone: [ { number: shipTo.primaryPhone ? shipTo.primaryPhone.phoneNumber : '' } ],
            email: [ shipTo.email ],
        });

        customer.address = orderAddress;
        customer.email = shipTo.email;

        return customer;
    } else {
        await internalCustomer.update(existing.customerId, { address: orderAddress });

        existing.address = orderAddress; // only use the current address on the order
        existing.email = shipTo.email;
        console.dir(existing, { depth: null });

        return existing;
    }
}

async function handleItems(items) {
    return await Promise.all(items.map(async item => {
        let details = await fetchItem(item.sku) || {};

        let taxTotal = 0;

        item.taxes.forEach(tax => {
            taxTotal += parseFloat(tax.amount.value);
        });

        return {
            details: details,
            platform: {
                itemId: item.lineItemId,
                site: item.purchaseMarketplaceId,
                quantity: item.quantity,
                price: parseFloat(item.lineItemCost.value),
                shippingCost: parseFloat(item.deliveryCost.shippingCost.value),
                shipByDate: item.lineItemFulfillmentInstructions.shipByDate,
                tax: taxTotal,
            },
        };
    }));
}

function handleShipping(data, items) {
    let method = shippingOptions[data.fulfillmentStartInstructions[0].shippingStep.shippingServiceCode] || data.fulfillmentStartInstructions[0].shippingStep.shippingServiceCode;

    // if (isMethodFirstClass(items)) {
    //     method = shippingOptions['USPSFirstClass'];
    // }

    return {
        method: method,
        cost: parseFloat(data.pricingSummary.deliveryCost.value),
    }
}

function handlePayments(data) {
    let payment = data.paymentSummary.payments[0];

    // return data.paymentSummary.payments.map(payment => {
        return {
            amount: parseFloat(payment.amount.value),
            date: payment.paymentDate,
            method: paymentMethods[payment.paymentMethod] || payment.paymentMethod,
            transactionId: payment.paymentReferenceId,
        }
    // });
}

function isMethodFirstClass(items) {
    let smallItemCount = 0;

    items.forEach(item => {
        item.release.media.forEach(m => {
            if (m.size <= process.env.SMALL_ITEM_SIZE_MAX) {
                smallItemCount += m.count;
            }
        })
    });

    return smallItemCount <= process.env.FIRST_CLASS_SMALL_ITEM_MAX;
}

module.exports = { build, handlePayments, handleShipping };
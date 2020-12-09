const fetchItem = require('../api/internal/item').fetch;
const shippingOptions = require('../static/shippingOptions');
const paymentMethods = require('../static/paymentMethods');

async function build(data) {
    let fulfillment = data.fulfillmentStartInstructions[0];
    let shipping = fulfillment.shippingStep;
    let shipTo = shipping.shipTo;
    let address = shipTo.contactAddress;
    let items = data.lineItems;

    let payload = {
        customer: {
            fullName: shipTo.fullName,
            company: shipTo.companyName,
            address1: address.addressLine1,
            address2: address.addressLine2,
            city: address.city,
            state: address.stateOrProvince,
            zip: address.postalCode,
            country: address.countryCode,
            phone: shipTo.primaryPhone ? shipTo.primaryPhone.phoneNumber : '',
            email: address.email,
        },
        platform: {
            site: 'eBay',
            orderId: data.orderId,
            customerId: data.buyer.username,
        },
        totals: {
            item: parseFloat(data.pricingSummary.priceSubtotal.value),
            tax: parseFloat(data.pricingSummary.tax.value),
            shipping: parseFloat(data.pricingSummary.deliveryCost.value),
            total: parseFloat(data.pricingSummary.total.value),
        }
    };

    payload.items = await handleItems(items);

    if (data.orderPaymentStatus === process.env.EBAY_PAID_ORDER_PAYMENT_STATUS) {
        payload.payment = handlePayments(data);
        payload.shipping = [ handleShipping(data, payload.items) ];
    }

    return payload;
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
            quantity: item.quantity,
            price: parseFloat(item.lineItemCost.value),
            shippingCost: parseFloat(item.deliveryCost.shippingCost.value),
            shipByDate: item.lineItemFulfillmentInstructions.shipByDate,
            tax: taxTotal,
            platform: {
                itemId: item.lineItemId,
                site: item.purchaseMarketplaceId,
            },
        };
    }));
}

function handleShipping(data, items) {
    let method = shippingOptions[data.fulfillmentStartInstructions[0].shippingStep.shippingServiceCode] || data.fulfillmentStartInstructions[0].shippingStep.shippingServiceCode;

    if (isMethodFirstClass(items)) {
        method = shippingOptions['USPSFirstClass'];
    }

    return {
        method: method,
        cost: parseFloat(data.pricingSummary.deliveryCost.value),
    }
}

function handlePayments(data) {
    return data.paymentSummary.payments.map(payment => {
        return {
            amount: parseFloat(payment.amount.value),
            date: payment.paymentDate,
            method: paymentMethods[payment.paymentMethod] || payment.paymentMethod,
            transactionId: payment.paymentReferenceId,
        }
    });
}

function isMethodFirstClass(items) {
    let smallItemCount = 0;

    items.forEach(item => {
        item.media.forEach(m => {
            if (m.size <= process.env.SMALL_ITEM_SIZE_MAX) {
                smallItemCount += m.count;
            }
        })
    });

    return smallItemCount <= process.env.FIRST_CLASS_SMALL_ITEM_MAX;
}

module.exports = build;
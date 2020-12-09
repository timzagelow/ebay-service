const Queue = require('bull');
require('dotenv').config();
const db = require('./db');
const api = require('./api');
const logger = require('./logger');
const removeItem = require('./workers/removeItem');
const addItem = require('./workers/addItem');
const updateItem = require('./workers/updateItem');

const moment = require('moment');
const createOrder = require('./workers/createOrder');

const auth = require('./auth');
const ebayAuth = require('./ebayAuth');

(async() => {
    await db.load();
    await auth.getToken();
    await ebayAuth.getToken();

    api.init();

    try {
        // let itemId = 149389;
        //
        // await updateItem(itemId);
        // logger.info(`Updated item ${itemId}`);

        // const orders = await order.fetchNew(Date.now());
        const orderData = await createOrder({
            "orderId": "08-06107-09621",
            "legacyOrderId": "313124572816-1070485112021",
            "creationDate": "2020-11-22T03:16:26.000Z",
            "lastModifiedDate": "2020-11-22T03:19:04.000Z",
            "orderFulfillmentStatus": "NOT_STARTED",
            "orderPaymentStatus": "PAID",
            "sellerId": "craigmoerer",
            "buyer": {
                "username": "ghbm5",
                "taxAddress": {
                    "stateOrProvince": "AL",
                    "postalCode": "35209-6247",
                    "countryCode": "US"
                }
            },
            "pricingSummary": {
                "priceSubtotal": {
                    "value": "35.0",
                    "currency": "USD"
                },
                "deliveryCost": {
                    "value": "4.0",
                    "currency": "USD"
                },
                "tax": {
                    "value": "2.8",
                    "currency": "USD"
                },
                "total": {
                    "value": "41.8",
                    "currency": "USD"
                }
            },
            "cancelStatus": {
                "cancelState": "NONE_REQUESTED",
                "cancelRequests": []
            },
            "paymentSummary": {
                "totalDueSeller": {
                    "value": "41.8",
                    "currency": "USD"
                },
                "refunds": [],
                "payments": [
                    {
                        "paymentMethod": "PAYPAL",
                        "paymentReferenceId": "9RH0037720632781G",
                        "paymentDate": "2020-11-22T03:16:29.000Z",
                        "amount": {
                            "value": "41.8",
                            "currency": "USD"
                        },
                        "paymentStatus": "PAID",
                        "paymentHolds": [
                            {
                                "holdReason": "ITEM_PRICE_INELIGIBLE",
                                "holdAmount": {
                                    "value": "41.8",
                                    "currency": "USD"
                                },
                                "holdState": "RELEASE_CONFIRMED",
                                "releaseDate": "2020-11-22T03:16:29.000Z"
                            }
                        ]
                    }
                ]
            },
            "fulfillmentStartInstructions": [
                {
                    "fulfillmentInstructionsType": "SHIP_TO",
                    "minEstimatedDeliveryDate": "2020-12-03T08:00:00.000Z",
                    "maxEstimatedDeliveryDate": "2020-12-03T08:00:00.000Z",
                    "ebaySupportedFulfillment": false,
                    "shippingStep": {
                        "shipTo": {
                            "fullName": "Burgin Mathews",
                            "contactAddress": {
                                "addressLine1": "893 Mountain Ridge Dr",
                                "city": "Birmingham",
                                "stateOrProvince": "AL",
                                "postalCode": "35209-6247",
                                "countryCode": "US"
                            },
                            "primaryPhone": {
                                "phoneNumber": "2053355608"
                            }
                        },
                        "shippingCarrierCode": "USPS",
                        "shippingServiceCode": "USPSMedia"
                    }
                }
            ],
            "fulfillmentHrefs": [],
            "lineItems": [
                {
                    "lineItemId": "10031270641208",
                    "legacyItemId": "313124572816",
                    "sku": "791689",
                    "title": " OUTLAWS: Behind The Walls LP (prison band) Country",
                    "lineItemCost": {
                        "value": "35.0",
                        "currency": "USD"
                    },
                    "quantity": 1,
                    "soldFormat": "FIXED_PRICE",
                    "listingMarketplaceId": "EBAY_US",
                    "purchaseMarketplaceId": "EBAY_US",
                    "lineItemFulfillmentStatus": "NOT_STARTED",
                    "total": {
                        "value": "41.8",
                        "currency": "USD"
                    },
                    "deliveryCost": {
                        "shippingCost": {
                            "value": "4.0",
                            "currency": "USD"
                        }
                    },
                    "appliedPromotions": [],
                    "taxes": [
                        {
                            "amount": {
                                "value": "2.8",
                                "currency": "USD"
                            }
                        }
                    ],
                    "ebayCollectAndRemitTaxes": [
                        {
                            "taxType": "STATE_SALES_TAX",
                            "amount": {
                                "value": "2.8",
                                "currency": "USD"
                            },
                            "collectionMethod": "NET"
                        }
                    ],
                    "properties": {
                        "buyerProtection": true
                    },
                    "lineItemFulfillmentInstructions": {
                        "minEstimatedDeliveryDate": "2020-12-03T08:00:00.000Z",
                        "maxEstimatedDeliveryDate": "2020-12-03T08:00:00.000Z",
                        "shipByDate": "2020-11-24T07:59:59.000Z",
                        "guaranteedDelivery": false
                    }
                }
            ],
            "ebayCollectAndRemitTax": true,
            "salesRecordReference": "631390",
            "totalFeeBasisAmount": {
                "value": "41.8",
                "currency": "USD"
            }
        });

        // console.dir(created, { depth: null });

    } catch (err) {
        // console.dir(err, { depth: null });

        // console.dir(err.response.data, { depth: null });
    }
})();

// setup job runner
// const ebayItemQueue = new Queue(process.env.EBAY_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
// ebayItemQueue.process(processor);
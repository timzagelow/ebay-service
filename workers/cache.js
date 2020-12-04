const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const axios = require('axios');
const moment = require('moment');
const coder = require('../coder');
const Cache = require('../models/Cache');
const EbayItem = require('../models/Item');

// set & get lastInventoryCheck here

function buildItemObject(item) {
    delete item._id;
    delete id;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.__v;

    return coder.encode(item);
}

function isItemSuppressed(item) {
    let isSuppressed = false;

    item.suppressed.forEach(suppressed => {
        if (suppressed.site === 'eBay') {
            isSuppressed = true;
        }
    });

    return isSuppressed;
}

function isItemActive(item) {
    let isActive = false;
    item.quantity.forEach(qty => {
        if (qty.type === 'active' && qty.count > 0) {
            isActive = true;
        }
    });

    return isActive;
}

function isEbayItemActive(item) {
    return item && item.status && item.status === 'active' && item.ebayItemId.length;
}

async function buildCache() {
    const items = await getLatest();

    for (let i = 0; i < items.length; i++) {
        // look up item in cache
        let cacheItem = await Cache.findOne({ itemId: items[i].id });
        let encodedItem = buildItemObject(items[i]);
        let ebayItem = await EbayItem.find({ itemId: items[i].id });

        if (!cacheItem) {
            // add to cache and determine if add job should be created
            const itemObj = {
                itemId: items[i].id,
                encodedItem: encodedItem,
            };

            try {
                await Cache.create(itemObj);
            } catch (err) {
                console.error(err);
            }

            let job = getJob(items[i], ebayItem);
            if (job) {
                console.log(job, items[i].id);
            }

            // handle job creation
        } else {
            // did cache change? @todo change this back to not equals!!!
            if (cacheItem.encodedItem === encodedItem) {
                let job = getJob(items[i], ebayItem);

                if (job) {
                    console.log(job, items[i].id);
                }
            }
        }
    }
}

function getJob(item, ebayItem) {
    if (isItemActive(item) && !isItemSuppressed(item) && !isEbayItemActive(ebayItem)) {
        return 'add'
    } else if (!isItemActive(item) && isEbayItemActive(ebayItem)) {
        return 'remove';
    } else if (isItemSuppressed(item) && isEbayItemActive(ebayItem)) {
        return 'remove';
    } else if (isItemActive(item) && isEbayItemActive(ebayItem)) {
        return 'update';
    }
}

async function getLatest() {
    const lastInventoryCheck = await getAsync('lastInventoryCheck');
    const { resp, data } = await axios.get(`${process.env.INVENTORY_API_URL}/inventory/new/${lastInventoryCheck}`);
    // console.log(resp);
    return data;
}

async function setLastChecked() {
    let date = moment().utc().toString();
    await setAsync('lastInventoryCheck', date);
}

module.exports = { buildCache };
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
const queue = require('../queue');

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

function itemHasPhotos(item) {
    return item.images && item.images.length > 0;
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

            await Cache.create(itemObj);

            let job = createJob(items[i], ebayItem);

            if (job) {
                console.log(job, items[i].id);
            }

            // handle job creation
        } else {
            if (cacheItem.encodedItem !== encodedItem) {
                let job = createJob(items[i], ebayItem);

                if (job) {
                    console.log(job, items[i].id);

                    cacheItem.encodedItem = encodedItem;

                    await cacheItem.save();
                }
            }
        }
    }

    await setLastChecked();
}

function createJob(item, ebayItem) {
    if (isItemActive(item) && !isItemSuppressed(item) && !isEbayItemActive(ebayItem) && itemHasPhotos(item)) {
        queue.addItemQueue.add({ itemId: item.id });

        return 'add';
    }

    if (!isItemActive(item) && isEbayItemActive(ebayItem)) {
        queue.removeItemQueue.add({ itemId: item.id });
        return 'remove';
    }

    if (isItemSuppressed(item) && isEbayItemActive(ebayItem)) {
        queue.removeItemQueue.add({ itemId: item.id });
        return 'remove';
    }

    if (isItemActive(item) && isEbayItemActive(ebayItem)) {
        queue.updateItemQueue.add({ itemId: item.id });
        return 'update';
    }
}

async function getLatest() {
    const lastInventoryCheck = await getAsync('lastInventoryCheck');
    const { resp, data } = await axios.get(`${process.env.INVENTORY_API_URL}/inventory/new/${lastInventoryCheck}`);

    return data;
}

async function setLastChecked() {
    let date = moment().utc().toString();
    await setAsync('lastInventoryCheck', date);
}

module.exports = buildCache;
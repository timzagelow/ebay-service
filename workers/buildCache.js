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

async function buildCache() {
    const items = await getLatest();

    console.log(`checking for inventory changes`);
    console.log(`${items.length} items to check against cache`);

    let jobs = [];

    for (let i = 0; i < items.length; i++) {
        let cacheItem = await Cache.findOne({ itemId: items[i].id });
        let encodedItem = buildItemObject(items[i]);
        let ebayItem = await EbayItem.findOne({ itemId: items[i].id });

        if (!cacheItem) {
            console.log(`No cache found for item ${items[i].id}`);

            // add to cache and determine if add job should be created
            const itemObj = {
                itemId: items[i].id,
                encodedItem: encodedItem,
            };

            await Cache.create(itemObj);

            let job = createJob(items[i], ebayItem);

            if (job) {
                jobs.push(job);
            }
        } else {
            if (cacheItem.encodedItem !== encodedItem) {
                let job = createJob(items[i], ebayItem);

                if (job) {
                    jobs.push(job);

                    cacheItem.encodedItem = encodedItem;

                    await cacheItem.save();
                }
            }
        }
    }

    if (jobs.length) {
        queue.itemQueue.add({jobs: jobs});
    }

    // await setLastChecked();
}

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
    return item && item.status && item.status === 'active' && item.listingId && item.listingId.length;
}

function createJob(item, ebayItem) {
    if (isItemActive(item) && !isItemSuppressed(item) && !isEbayItemActive(ebayItem) && itemHasPhotos(item)) {
        return { type: 'add', itemId: item.id };
    }

    if (!isItemActive(item) && isEbayItemActive(ebayItem)) {
       return { type: 'remove', itemId: item.id };
    }

    if (isItemSuppressed(item) && isEbayItemActive(ebayItem)) {
        return { type: 'remove', itemId: item.id };
    }

    if (isItemActive(item) && isEbayItemActive(ebayItem)) {
        return { type: 'update', itemId: item.id };
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
const client = require('../redisClient');
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

    let newJobs = [];

    for (let i = 0; i < items.length; i++) {
        let cacheItem = await Cache.findOne({ itemId: items[i].itemId });
        let encodedItem = buildItemObject(items[i]);
        let ebayItems = await EbayItem.find({ itemId: items[i].itemId });

        if (!cacheItem) {
            console.log(`No cache found for item ${items[i].itemId}`);

            // add to cache and determine if add job should be created
            const itemObj = {
                itemId: items[i].itemId,
                encodedItem: encodedItem,
            };

            await Cache.create(itemObj);

            let jobs = getJobs(items[i], ebayItems);

            if (jobs.length) {
                jobs.forEach(job => {
                    newJobs.push(job);
                });
            }
        } else {
            if (cacheItem.encodedItem !== encodedItem) {
                console.log('cache is different');
                let jobs = getJobs(items[i], ebayItems);

                if (jobs.length) {
                    jobs.forEach(job => {
                        newJobs.push(job);
                    });
                }

                cacheItem.encodedItem = encodedItem;

                await cacheItem.save();
            }
        }
    }

    if (newJobs.length) {
        queue.itemQueue.add({ jobs: newJobs });
    }

    return await setLastChecked();
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

function isListingReady(listing, item) {
    return listing.type === 'active' &&
        listing.count > 0 &&
        listing.images &&
        listing.images.length;
}

function isListingActiveOnEbay(listing, ebayItems) {
    let isActive = false;

    ebayItems.forEach(ebayItem => {
        if (ebayItem.status === 'active' &&
            ebayItem.listingId === listing._id &&
            ebayItem.ebayListingId) {

            isActive = true;
        }
    });

    return isActive;
}

function isListingOffsite(listing) {
    return listing.offsite;
}

function getJobs(item, ebayItems) {
    let jobs = [];

    item.listing.forEach(listing => {
        if (!isItemSuppressed(item) && isListingReady(listing, item) && !isListingActiveOnEbay(listing, ebayItems) && !isListingOffsite(listing)) {
            jobs.push({ type: 'add', itemId: item.itemId, listingId: listing._id });
        } else if (!isItemSuppressed(item) && isListingReady(listing, item) && isListingActiveOnEbay(listing, ebayItems)) {
            jobs.push({ type: 'update', itemId: item.itemId, listingId: listing._id });
        } else if (!isListingReady(listing, item) && isListingActiveOnEbay(listing, ebayItems)) {
            jobs.push({ type: 'remove', itemId: item.itemId, listingId: listing._id });
        } else if (isItemSuppressed(item) && isListingReady(listing, item) && isListingActiveOnEbay(listing, ebayItems)) {
            jobs.push({ type: 'remove', itemId: item.itemId, listingId: listing._id });
        } else if (isListingOffsite(listing) && isListingActiveOnEbay(listing, ebayItems)) {
            jobs.push({ type: 'remove', itemId: item.itemId, listingId: listing._id });
        }
    });

    return jobs;
}

async function getLatest() {
    const lastInventoryCheck = await getAsync('lastInventoryCheck');

    const { resp, data } = await axios.get(`${process.env.INVENTORY_API_URL}/new/${lastInventoryCheck}`);

    return data;
}

async function setLastChecked() {
    let date = moment().utc().toString();
    await setAsync('lastInventoryCheck', date);
}

module.exports = buildCache;
const axios = require('axios');
const conditions = require('../static/conditions');
const builder = require('../builders/item');
const buildTitle = require('../builders/title');

async function add(itemId) {
    const item = await fetchItem(itemId);
    const inventoryItem = build(item);

    console.dir(item, { depth: null });
    console.dir(inventoryItem, { depth: null });
}

async function fetchItem(itemId) {
    const item = await axios.get(`${process.env.INVENTORY_API_URL}/inventory/${itemId}`);

    return item.data;
}

function build(item) {
    builder.item = item;

    let itemQuantity = builder.availableQuantity();

    let condition = conditions[builder.condition()];
    let aspects = {
        Artist: [ builder.artist() ],
        Duration: [ builder.duration() ], // LP, EP, Single, Double LP, Box Set
        'Record Label': [ item.label.name ],
        Genre: [ builder.genre() ],
        Speed: [ builder.speed() ], // 33, 45, 78
        'Record Size': [ builder.size() ],
        'Record Grading': [ builder.condition() ],
        Title: [ builder.title() ],
    };

    if (builder.style()) {
        aspects['Style'] = builder.style();
    }

    if (item.attributes.length) {
        aspects['Special Attributes'] = item.attributes;
    }

    if (builder.releaseYear()) {
        aspects['Release Year'] = builder.releaseYear();
    }

    if (builder.edition().length) {
        aspects['Edition'] = builder.edition();
    }

    // console.log(builder.condition('cover'));

    if (builder.condition('cover')) {
        aspects['Sleeve Grading'] = builder.condition('cover');
    }

    // let imageUrls = [ 'https://www.recordsbymail.com/transparent-glowing-logo.png' ];

    return {
        availability: {
            shipToLocationAvailability: {
                quantity: itemQuantity
            },
        },
        condition: condition,
        product: {
            aspects: aspects,
            // description: buildDescription(item),
            imageUrls: builder.imageUrls(),
            title: buildTitle(item),
        }
    };
}

module.exports = add;
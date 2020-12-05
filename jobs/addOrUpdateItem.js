const conditions = require('../static/conditions');
const builder = require('../builders/item');
const buildTitle = require('../builders/title');
const inventoryItem = require('../api/partner/inventoryItem');

async function addOrUpdate(itemId, item) {
    const payload = await build(item);

    return await inventoryItem.add(itemId, payload);
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

    if (builder.condition('cover')) {
        aspects['Sleeve Grading'] = builder.condition('cover');
    }

    // let imageUrls = builder.imageUrls();
    let imageUrls = [ 'https://www.recordsbymail.com/transparent-glowing-logo.png' ];

    return {
        availability: {
            shipToLocationAvailability: {
                quantity: itemQuantity
            },
        },
        condition: condition,
        product: {
            aspects: aspects,
            imageUrls: imageUrls,
            title: buildTitle(item),
        },
        upc: [ 'Does not apply' ],
    };
}

module.exports = addOrUpdate;
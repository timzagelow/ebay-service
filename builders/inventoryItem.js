const conditions = require('../static/conditions');
const builder = require('../builders/item');
const buildTitle = require('../builders/title');

function build(item, listingId) {
    builder.item = item;
    builder.listing = builder.getListing(listingId);

    let itemQuantity = builder.availableQuantity(listingId);

    let condition = conditions[builder.condition(listingId)];
    let aspects = {
        Artist: [ builder.artist() ],
        Duration: [ builder.duration() ], // LP, EP, Single, Double LP, Box Set
        'Record Label': [ item.release.label.name ],
        Genre: [ builder.genre() ],
        Speed: [ builder.speed() ], // 33, 45, 78
        'Record Size': [ builder.size() ],
        'Record Grading': [ builder.condition() ],
        Title: [ builder.title() ],
    };

    if (builder.style()) {
        aspects['Style'] = builder.style();
    }

    if (builder.listing.attributes.length) {
        aspects['Special Attributes'] = builder.listing.attributes;
    }

    if (builder.releaseYear()) {
        aspects['Release Year'] = builder.releaseYear();
    }

    if (builder.edition().length) {
        aspects['Edition'] = builder.edition();
    }

    if (builder.condition('cover')) {
        aspects['Sleeve Grading'] = [ builder.condition('cover') ];
    }

    let imageUrls = builder.imageUrls();

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

module.exports = build;
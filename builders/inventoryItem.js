const builder = require('../builders/item');
const buildTitle = require('../builders/title');

function build(item, listingId) {
    builder.item = item;
    builder.listing = builder.getListing(listingId);

    let itemQuantity = builder.availableQuantity();

    let condition = builder.condition() === 'SS' ? process.env.EBAY_NEW_CONDITION_ID : process.env.EBAY_USED_CONDITION_ID;

    let aspects = {
        Artist: [ builder.artist() ],
        Duration: [ builder.duration() ], // LP, EP, Single, Double LP, Box Set
        'Record Label': [ item.release.label.name ],
        Genre: [ builder.genre() ],
        Speed: [ builder.speed() ], // 33, 45, 78
        'Record Size': [ builder.size() ],
        Title: [ builder.title().substring(0, process.env.EBAY_ASPECT_TITLE_MAX) ],
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

    if (builder.findCondition('item')) {
        aspects['Record Grading'] = [ builder.condition('item') ];
    } else if (builder.findCondition('disc')) {
        aspects['Record Grading'] = [ builder.condition('disc') ];
    }

    if (builder.findCondition('cover')) {
        aspects['Sleeve Grading'] = [ builder.condition('cover') ];
    }

    console.log(aspects);

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
            upc: [ 'Does not apply' ],
        },
    };
}

module.exports = build;
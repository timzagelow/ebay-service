const axios = require('axios');
const conditions = require('../static/conditions');

async function get(itemId) {
    try {
        const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`);

        // console.dir(data, { depth: null});
        return data;
    } catch (err) {
        console.log(err.response.data);
    }
}

async function add(itemId) {
    try {
        let params = buildItemPayload(item);

        const { data } = await axios.put(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`, params, config);

        return data;
    } catch (err) {
        console.log(err.response.data);
    }
}

function buildDescription(item) {
    return '<P>This is an amazing description</P>';
}

function buildTitle(item) {
    return 'JOHNNY CHINGAS: phone home BILLIONAIRE';
}

function buildItemPayload(item) {
    let itemQuantity = 1;
    let condition = conditions['VG+'];
    let aspects = {
        Artist: [ 'JOHNNY CHINGAS' ],
        Duration: [ 'LP' ], // LP, EP, Single, Double LP, Box Set
        'Record Label': [ 'BILLIONAIRE' ],
        Genre: [ 'Soul' ],
        Style: [ 'Electro-Funk' ],
        Speed: [ '33 RPM' ], // 33, 45, 78
        'Record Size': [ '12"' ],
        'Special Attributes': [ 'Colored Vinyl' ],
        'Release Year': [ '1989' ],
        Edition: [ 'Promo' ],
        'Record Grading': [ 'Very Good Plus (VG+)' ],
        'Sleeve Grading': [ 'Very Good Plus (VG+)' ],
        Title: [ 'Phone Home' ],
        'Country/Region of Manufacture': [ 'United States' ],
    };
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
            description: buildDescription(item),
            imageUrls: imageUrls,
            title: buildTitle(item),
        }
    };
}

module.exports = { add, get };
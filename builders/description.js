require('dotenv').config();
const Handlebars = require('handlebars');
const builder = require('../builders/item');
const axios = require('axios');

async function build(item) {
    const view = {
        artist: builder.artist(),
        title: builder.title(),
        label: item.release.label.name,
        catalogNo: item.release.label.catalogNo,
        deadwax: item.release.label.deadwax,
        address: item.release.label.address,
        locale: item.release.label.locale,
        format: builder.mediaTexts().join(', '),
        condition: builder.conditions(),
        speed: builder.speed(),
        genre: builder.genres().join(', '),
        price: builder.listing.price,
        notes: builder.notes().join(', '),
        pressing: builder.pressing(),
        attributes: builder.listing.attributes.join(', '),
        additions: builder.listing.additions.join(', '),
        clips: builder.clipUrls(),
    };

    const { data } = await axios.get(process.env.LISTING_DESCRIPTION_TEMPLATE);
    const template = Handlebars.compile(data);

    return template(view);
}

module.exports = build;
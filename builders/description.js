const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const builder = require('../builders/item');

async function build(item) {
    const view = {
        artist: builder.artist(),
        title: builder.title(),
        label: item.release.label.name,
        catalogNo: item.release.label.catalogNo,
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

    const templateStr = await fs.readFileSync(path.resolve(__dirname, "../templates/description.html")).toString();
    const template = Handlebars.compile(templateStr);

    return template(view);
}

module.exports = build;
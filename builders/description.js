const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const builder = require('../builders/item');

async function build(item) {
    const view = {
        artist: builder.artist(),
        title: builder.title(),
        label: item.label.name,
        catalogNo: item.label.catalogNo,
        format: `${builder.size()} ${builder.duration()}`,
        discCondition: builder.condition(),
        speed: builder.speed(),
        genre: builder.genre(),
        price: item.price,
        notes: builder.notes().join(', '),
    };

    const templateStr = await fs.readFileSync(path.resolve(__dirname, "../templates/description.html")).toString();
    const template = Handlebars.compile(templateStr);

    return template(view);
}

module.exports = build;
const itemBuilder = require('./item');

function build(item) {
    itemBuilder.item = item;

    let title = `${itemBuilder.artist()}: ${itemBuilder.title()}`;

    if ((title.length + item.label.name.length) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${item.label.name}`;
    }

    if ((title.length + itemBuilder.size().length) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${itemBuilder.size()}`;
    }

    if ((title.length + itemBuilder.duration().length) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${itemBuilder.duration()}`;
    }

    return title;
}

module.exports = build;
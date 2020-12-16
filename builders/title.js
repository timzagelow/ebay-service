const itemBuilder = require('./item');

function build(item) {
    itemBuilder.item = item;

    let title = `${itemBuilder.artist()}: ${itemBuilder.title()}`;

    if (title.length >= process.env.EBAY_TITLE_MAX_LENGTH) {
        title = title.substring(0, process.env.EBAY_TITLE_MAX_LENGTH);
    }

    if ((title.length + item.release.label.name.length) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${item.release.label.name}`;
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
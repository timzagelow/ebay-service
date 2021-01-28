const itemBuilder = require('./item');

function build(item) {
    itemBuilder.item = item;

    let title = `${itemBuilder.artist()}: ${itemBuilder.title()}`;

    if ((title.length + item.release.label.name.length + ` `) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${item.release.label.name}`;
    }

    if ((title.length + itemBuilder.size().length + ` `) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${itemBuilder.size()}`;
    }

    if ((title.length + itemBuilder.duration().length + ` `) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${itemBuilder.duration()}`;
    }

    if ((title.length + itemBuilder.speed().length + ` `) <= process.env.EBAY_TITLE_MAX_LENGTH) {
        title += ` ${itemBuilder.speed()}`;
    }

    return title.substring(0, process.env.EBAY_TITLE_MAX_LENGTH);
}

module.exports = build;
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

    let grade = itemBuilder.condition();

    if (grade && grade === 'SS') {
        if ((title.length + ` Sealed`) <= process.env.EBAY_TITLE_MAX_LENGTH) {
            title += ` Sealed`;
        }
    }

    return title.substring(0, process.env.EBAY_TITLE_MAX_LENGTH);
}

module.exports = build;
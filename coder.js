function encode(obj) {
    const str = JSON.stringify(obj);
    const buff = Buffer.from(str, 'utf-8');

    return buff.toString('base64');
}

function decode(encoded) {
    const buff = Buffer.from(encoded, 'base64');

    const str = buff.toString('utf-8');

    return JSON.parse(str);
}

function base64encode(str) {
    const buff = Buffer.from(str, 'utf-8');

    return buff.toString('base64');
}

module.exports = { encode, decode, base64encode };
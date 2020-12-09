const logger = require('./logger');
const slack = require('./slack');

function handleApiError(msg, error) {
    let code = error.response.status;

    logger.error(msg, { code: code, errors: error.response.data.errors });

    slack('eBay Service Error', msg);

    throw Error(msg);
}

function handleError(msg) {
    logger.error(msg);

    slack('eBay Service Error', msg);

    throw Error(msg);
}

module.exports = { handleError, handleApiError };


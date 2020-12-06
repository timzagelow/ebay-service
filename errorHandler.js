const logger = require('./logger');

function handleApiError(msg, error) {
    let code = error.response.status;

    logger.error(msg, { code: code, errors: error.response.data.errors });

    throw Error(msg);
}

function handleError(msg) {
    logger.error(msg);

    throw Error(msg);
}

module.exports = { handleError, handleApiError };


const logger = require('./logger');
const slack = require('./slack');
const JobError = require('./models/JobError');

function handleError(msg, error) {
    if (error.response && error.response.status && error.response.data.errors) {
        logger.error(msg, { code: error.response.status, error: error.response.data.errors });

        JobError.create({
            message: msg,
            error: error.response.data.errors,
        });

    } else {
        if (error.message) {
            logger.error(msg, { error: error.message });

            JobError.create({
                message: msg,
                error: error.message,
            });

        } else {
            logger.error(msg);

            JobError.create({
                message: msg,
                error: error,
            });
        }
    }

    // slack('eBay Service Error', msg);
}

module.exports = { handleError };


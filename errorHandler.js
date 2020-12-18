const logger = require('./logger');
const JobError = require('./models/JobError');

function handleError(msg, error) {
    if (error.response && error.response.status && error.response.data.errors) {
        msg += ` - ${error.response.data.errors[0].message}`;

        logger.error(msg, { code: error.response.status, error: error.response.data.errors });

        JobError.create({
            message: msg,
            error: error.response.data.errors,
        });

    } else {
        if (error.message) {
            console.log(error);
            logger.error(msg, { error: error.message });

            JobError.create({
                message: msg,
                error: error.message,
            });

        } else {
            logger.error(error);
            logger.error(msg);

            JobError.create({
                message: msg,
                error: error,
            });
        }
    }
}

module.exports = { handleError };


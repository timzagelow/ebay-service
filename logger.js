const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
    let msg = `${timestamp} [${level}] : ${message} `;

    if (metadata) {
        msg += JSON.stringify(metadata);
    }

    return msg;
});

const logger = createLogger({
    format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console()]
});

module.exports = logger;

//
// logger.info('hey now!', { errors: [ { blah: 'blah' }]});
//
// logger.error('testing', { errors: 'errors' });

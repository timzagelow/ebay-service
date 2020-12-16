const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CloudWatchTransport = require('winston-aws-cloudwatch');
const SlackHook = require('winston-slack-webhook-transport');

const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
    let msg = `${timestamp} [${level}] : ${message} `;

    if (metadata) {
        msg += JSON.stringify(metadata);
    }

    return msg;
});

const consoleConfig = {
    format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        myFormat
    ),
};

const slackFormatter = ({ level, message, timestamp , ...metadata}) => {
    let fields = [];
    fields.push({type: "mrkdwn", text: message});

    if (metadata.length) {
        fields.push({ type: "mrkdwn", text: JSON.stringify(metadata) });
    }

    return {
        blocks: [
            {
                type: 'context',
                elements: [{
                    type: 'mrkdwn',
                    text: `${process.env.APP_NAME} ${level}`,
                }]
            },
            {
                "type": "divider"
            },
            {
                type: 'section',
                fields: fields
            },
        ]
    }
};

const cloudWatchConfig = {
    logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
    logStreamName: NODE_ENV,
    createLogGroup: false,
    createLogStream: true,
    awsConfig: {
        accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
        region: process.env.CLOUDWATCH_REGION
    },
};

const logger = createLogger({
    transports: [
        new transports.Console(consoleConfig)
]});

if (NODE_ENV === 'production') {
    logger.add(new CloudWatchTransport(cloudWatchConfig));
    logger.add(new SlackHook({
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        formatter: slackFormatter
    }));
}

logger.level = process.env.LOG_LEVEL || "silly";

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;

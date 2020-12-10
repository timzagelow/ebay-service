require('dotenv').config();
const slack = require('slack-notify')(process.env.SLACK_WEBHOOK_URL);

function alert(text, fields) {
    let obj = { text: text };

    if (fields) {
        obj.fields = fields;
    }

    slack.alert(obj);
}

module.exports = alert;


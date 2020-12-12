const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token = 'v^1.1#i^1#I^3#p^3#f^0#r^0#t^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';

    static async getToken() {
        if (!Auth.token.length) {
            try {
                Auth.token = await Auth.refreshToken();
            } catch (error) {
                console.log(error);
            }
        }

        return Auth.token;
    }

    static setToken(token) {
        Auth.token = token;
    }

    static async refreshToken() {
        let credentials = coder.base64encode(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`);

        let url = `${process.env.EBAY_API_URL}/identity/v1/oauth2/token`;
        let config = {
            headers: {
                Authorization: `Basic ${credentials}`
            }
        };

        let payload = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: process.env.EBAY_REFRESH_TOKEN,
            scope: process.env.EBAY_API_SCOPE,
        });

        const response = await axios.post(url, payload, config);

        return Promise.resolve(response.data.access_token);
    }
};
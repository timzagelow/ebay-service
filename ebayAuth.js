const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token = '';

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
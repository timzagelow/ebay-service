const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token = '';

    static async getToken() {
        if (!Auth.token.length) {
            try {
                Auth.token = await Auth.fetchToken();
            } catch (error) {
                console.log(error.response);
            }
        }

        return Auth.token;
    }

    static setToken(token) {
        Auth.token = token;
    }

    static async fetchToken() {
        let payload = {
            audience: process.env.API_IDENTIFIER,
            grant_type: process.env.API_GRANT_TYPE,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        };

        let url = `https://${process.env.API_DOMAIN}oauth/token`;

        const response = await axios.post(url, payload);

        return Promise.resolve(response.data.access_token);
    }
};
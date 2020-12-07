const axios = require('axios');
const ebayAuth = require('./ebayAuth');
const logger = require('./logger');
const auth = require('./auth');

function init() {
    axios.interceptors.request.use(req => {
        if (req.url.includes(process.env.EBAY_API_URL) && !req.url.includes('identity')) {
            req.headers.authorization = `Bearer ${ebayAuth.token}`;
            req.headers['Content-Language'] = 'en-US';
        } else if (req.url.includes(process.env.ORDERS_API_URL) ||
            req.url.includes(process.env.INVENTORY_API_URL)) {
            req.headers.authorization = `Bearer ${auth.token}`;
        }

        console.log(`${req.method} ${req.url}`);

        return req;
    });

    axios.interceptors.response.use(response => response, error => {
        if (error.code === 'ECONNREFUSED') {
            logger.error('Connection refused', error.config);

        }

        return Promise.reject(error);
    });

    createAxiosResponseInterceptor();
}

function createAxiosResponseInterceptor() {
    const interceptor = axios.interceptors.response.use(
        response => response,
        error => {
            // Reject promise if usual error
            if (error.response.status !== 401) {
                return Promise.reject(error);
            }

            /*
             * When response code is 401, try to refresh the token.
             * Eject the interceptor so it doesn't loop in case
             * token refresh causes the 401 response
             */
            axios.interceptors.response.eject(interceptor);

            // console.log(error.response.data);
            if (error.response.config.url.includes(process.env.EBAY_API_URL)) {
                return handleEbayRefresh(error);
            }

            if (error.response.config.url.includes(process.env.ORDERS_API_URL) ||
                error.response.config.url.includes(process.env.INVENTORY_API_URL)) {
                return handleInternalRefresh(error);
            }

            return Promise.reject(error);
        }
    );
}

function handleEbayRefresh(error) {
    return ebayAuth.refreshToken().then((accessToken) => {
        ebayAuth.setToken(accessToken);

        error.response.config.headers['Authorization'] = 'Bearer ' + accessToken;

        return axios(error.response.config);
    }).catch(error => {
        ebayAuth.setToken('');

        return Promise.reject(error);
    }).finally(createAxiosResponseInterceptor);
}

function handleInternalRefresh(error) {
    return auth.fetchToken().then(accessToken => {
        auth.setToken(accessToken);
        error.response.config.headers['Authorization'] = 'Bearer ' + accessToken;

        return axios(error.response.config);
    }).catch(error => {
        auth.setToken('');

        return Promise.reject(error);
    }).finally(createAxiosResponseInterceptor);
}


module.exports = { init };
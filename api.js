const axios = require('axios');
const auth = require('./auth');

function init() {
    axios.interceptors.request.use(req => {
        if (req.url.includes(process.env.EBAY_API_URL) && !req.url.includes('identity')) {
            req.headers.authorization = `Bearer ${auth.token}`;
            req.headers['Content-Language'] = 'en-US';
        }

        // console.log(`${req.method} ${req.url}`);
        // Important: request interceptors **must** return the request.
        return req;
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
            return auth.refreshToken().then(response => {
                console.log('refreshing token');
                console.log('response from refresh token', response);

                auth.token = response.data.access_token;

                error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;

                return axios(error.response.config);
            }).catch(error => {
                console.log('error refreshing token');
                console.log(error.response);

                auth.token = null;

                return Promise.reject(error);
            }).finally(createAxiosResponseInterceptor);
        }
    );
}

module.exports = { init };
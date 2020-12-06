const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token = 'v^1.1#i^1#r^0#f^0#p^3#I^3#t^H4sIAAAAAAAAAOVXa2wUVRTu9sVLJKBBRMR1JIRSZvfOzM4+BnZx+2JX6YPdArZImjszd9ppZ2fWmbvtLj9MrbEaTBCNj0QSqPhATJQgMaQBBH4QCZFfGiUISDWkGiKRhKQaMHhn+2BbFQiLsYnzZ3LvPffc833nu48DukunLe2N9A7NdEwp7OsG3YUOBzMDTCstKb+3qHB+SQHIMXD0dS/qLu4p+mmFBRNaUoghK2noFnKmE5puCdnOIJUydcGAlmoJOkwgS8CSEA/XrhZYFxCSpoENydAoZ7QqSPkDoszLMgpIPCMDSSS9+qjPRiNIeT0iCvC8rChezgcQR8YtK4WiuoWhjoMUC1hAMywNvI1MQGCAwAEX6/M0U851yLRUQycmLkCFsuEK2blmTqw3DxVaFjIxcUKFouGaeH04WlVd17jCneMrNMJDHEOcssa3Kg0ZOddBLYVuvoyVtRbiKUlClkW5Q8MrjHcqhEeDuYPws1QrAaiIXqRABfp4XlHuCpU1hpmA+OZx2D2qTCtZUwHpWMWZWzFK2BDbkYRHWnXERbTKaf/WpKCmKioyg1R1Rbhpbbw6RjnjDQ2m0anKSLaRMhwHWD/nYagQRhahEJktWE1sgq1IM7pGVht2OcL1hOUqDV1WbeYsZ52BKxAJHU0kCOQQRIzq9XozrGA7rBw7lhkl0htotjM7nMoUbtPt5KIEYcOZbd46DaO6uKGEu6UMKMsiw7B+FoiIY3woVxn2Xr9TdYTsBIUbGtx2LEiEGToBzQ6EkxqUEC0RelMJZKqywPEKy/kVRMvegEJ7AopCi7zspRkFIYCQKEoB//9OJBibqpjCaEwoEweySIOUTaygQkXARgfSGzNJRE20zB5CI+pIW0GqDeOk4HZ3dXW5ujiXYba6WQAY91O1q+NSG0pAasxWvbUxrWalKxHZEHsBkwCCVJrIkCyut1KhWHVNrDoeaWmsf7K6blTC4yILTez9B6RxJJkITy505R2+Or0yU1GbhF2rkpGwD7eH04nmCNabI/EA1xmrdK9qbdLr0mo0mB94yUiiBkNTpcy/xYC91++MBc6UG6CJMxWpDGnHkaaRX15wLRvu5Eq1Pd8iDmBSddmbziUZCbcByeltd7VkI3ZbBLtL1TvJfjXMjPP250BJMlLkNrj9GUpKU1RNs4+GvKg2kaya5FxrSZnq5GI8hiTDlK2WikxLLVQ1eqRdQUMZirSHVnBK0tvzAh9OJqOJRApDUUNReXLB53nO780b3d+DInt913+d19E8SrxC+z1eidyHPPDzAYnjvXJeuKtQ52RLJmCQz+dnIM1JcoD2eD0c7ec9DGkyAVYRZfIgEPPCrMJJdjUyXuADpGrzcnnhqtRUcsJNvndNxLAwum2ZTujIedT95VHvHl9ahwqyH9PjOAR6HP2kOie00kw5KCstWltcdA9lqRi5LKjLopF2kYegy1JbdVI5msjVgTJJqJqFpQ719NfSbzlFfd9GMG+srJ9WxMzIqfHBghsjJcysB2aygGGBlwkwgAPN4LEbo8XM3OL7iy8Wx5WV3rKHPlo2/+RLNd3PvFFUAmaOGTkcJQXFPY6C9M4LCy++tXyoPrTxSM2n/utNA12bVx6G+79lk9eOnbzvs/U4tmv6+/EnDq1/9+DpN3t/4Q+ecFR/PBR++Y+tx5v2h1/YVNpxtW/OjqdL2Mf39J0//g749XDb9IEpRr+55ed6sPYr63L71h2vOa1ZHz4YnfPdvOeWH3t4zeVTU66cuTTYeOZa5at7hy5d3fDo0RcvLJ717OzeOLN69jcnot9vOlcXaa66cvbLT3YcmbogHe57pGrZhpVTZ28rmdp+dWn5mes/nPIP0IP9jjnntxxd8PmRRYPP7z719r7nF17erEzfW9s/N7Lv3Pa9r5cdckZKKsvcrxyojS0Jbv9i5+YloW3MB9zAe4tn/L77wI+De84Op/FPFGtvrG4RAAA=';

    static async getToken() {
        if (!Auth.token.length) {
            try {
                console.log('refreshing');
                Auth.token = await Auth.refreshToken();
            } catch (err) {
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

        return await axios.post(url, payload, config);
    }
};
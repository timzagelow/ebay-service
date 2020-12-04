const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token = 'v^1.1#i^1#r^0#f^0#p^3#I^3#t^H4sIAAAAAAAAAOVXa2wUVRTu9qUVaqNBfKGsA2igzO6dmX3NhF3c7YOuttulW4itmDo7c6e97Tw2M3faXWKwVHkkhtjE8EeiEsEoEkKRH4rENIbwSnwgMSHRqIkxkcefVjQY+eOd7YNtVSAsxibOn8k599xzz/edcx8HDFZWrdjatPVKteuO0t2DYLDU5WLmgarKitq7y0ofqigBBQau3YNLB8uHys6vskRNzQht0MoYugXdWU3VLSGvDFO2qQuGaCFL0EUNWgKWhFS0pVlgPUDImAY2JEOl3PH6MJXmIc/zCu9nFF7xMUGi1ad8ththipVCwOdXRNancCwLGTJuWTaM6xYWdUzGAQtohqWBr51lBJYXQMATYv2dlHs9NC1k6MTEA6hIPlwhP9csiPX6oYqWBU1MnFCReLQx1RqN1zck2ld5C3xFJnlIYRHb1kypzpChe72o2vD6y1h5ayFlSxK0LMobmVhhplMhOhXMLYSfpzoQTHOBgAxhgAsCNnh7qGw0TE3E14/D0SCZVvKmAtQxwrkbMUrYSPdCCU9KCeIiXu92fmttUUUKgmaYaohFO9alGtoodyqZNI1+JEPZQcpwHGBDnI+hIhhahEJodmGkbRS7oWoMTK424XKS61nL1Rm6jBzmLHfCwDFIQoezCWIKCCJGrXqrGVWwE1ahHTdNJNPpZHYilTbu0Z3kQo2w4c6LN07DVF1cq4TbVRlcwM/yPBQBy3IQSr7CynD2+q1WR8RJUDSZ9DqxwLSYozXR7IM4o4oSpCVCr61BE8kC51dYLqRAWg7wCu3jFYVO++UAzSgQAgjTaYkP/e+KBGMTpW0Mpwtl9kAeaZhyiBWQqAjY6IN6ey4DqdmW+UNosjqyVpjqwTgjeL0DAwOeAc5jmN1eFgDG+0xLc0rqgZpITduiGxvTKF+6EiSzLCRgEkCYypIyJIvr3VSkraGxrSHV1NXe+nRDYqqEZ0QWma39B6QpKJkQzy10tX3BhF6Xi7VkxIE1maZoEPdGs1pnE9Y7m1I8199W513T3aEnsigeLg68ZGRg0lCRlPu3GHD2+q2xwJlyUjRxLmbniJyCqkp+RcG1HLhzK9XOfIs4EDPI42w6j2RoXkMkp7ej6spH7LUIdg/S+8l+Ncyc++bniJJk2OQ2uPkZiq0qSFWdo6Eoqk0oI5Oca122ieYW421QMkzZ6orlulpEpNKTcowWZTFN+2gF25LeWxT4aCYT1zQbi2kVxuW5Bd/v50KBotH9PSiy19/9r/M6lUfJr9AhX0Ai96EfhPy8xPkDclG462H/XEsmYGAwGGJEmpNknvYFfBwd8vsYIjI8q6Rl8iBIF4UZiXPsamQCIAhIrxHgisJVpyJyws29d02TYWF402U6S1HwqPvLo947s7WOlOQ/Zsj1CRhyHSHdOaGVZmrB8sqydeVl8ykLYeixRF1OG1kPeQh6LNStk87RhJ4+mMuIyCytdKFvvpZ+L2jqdz8HHphu66vKmHkFPT5YdG2kgqm5v5oFDAt8LMPyINAJllwbLWcWli+IjVwSTr/hee3bWGOdtPinXec/3LQPVE8buVwVJeVDrpIONmRpcvRA4vXKV7eFBtdi9u3azc2XPz083pB7z/Vs3fEjV5ZTwqbHVo/8cuogGE0ort8oQ3nkxxNHPv4cj/FVJzr27K1pX6JB986LPUCPfHBq4x9v/bDD2927dvi7e4z3N0eevzB8aP/o6PiCodGDy+5bdC6hH2p/56VNT+09Vnl16cvCXTJnbN98bMzPhqVLO8+trF1Yy18ePdOcGTt+esVqX3fNm7uih/aoH2V3vDg2vOXJxeyF5Nn4ePTho0H//oXzn3hhe612FV1EXya3f/b4VxvGjGVn+A1nBc82dfjS0dZz+zhcPXISZYdfeXDlSM/h76/UfIG3jN85fmCg+ueWe08++utEGv8ETRUti24RAAA=';

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
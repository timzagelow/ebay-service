const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token = 'v^1.1#i^1#p^3#f^0#r^0#I^3#t^H4sIAAAAAAAAAOVXa2wUVRTu9gWIwB8VIUg2A4nSOrvz2J3dHdmV3T7Yje127RYiTWq5O3Onve3szDpzp7sr1tQSH4lPBP0lz0RB6g/8SUHjDwOmRCIBQyUiRIM8NJqYoBiC8c72wbYqEBZjE+fP5J577rnn+865957DDFTPqXkh+sJv8xyzyncMMAPlDgc7l5lTXVU7v6J8cVUZU6Tg2DGwfKBysOLCShOk1YzYCs2MrpnQmUurmikWhEHKMjRRByYyRQ2koSliSUyGm5tEzsWIGUPHuqSrlDNWH6R8ECg+GXgg64UwIClEqk3YbNPJvMwyXgF6ODbl4fyCn8ybpgVjmomBhoMUx3AMzXI0I7RxrMh7RZZ3+QJ8O+VcCw0T6RpRcTFUqOCuWFhrFPl6Y1eBaUIDEyNUKBZuTLaEY/UN8baV7iJboXEekhhgy5w6qtNl6FwLVAveeBuzoC0mLUmCpkm5Q2M7TDUqhiecuQ33x6jmWUmQFV7w8Kxyp6hs1I00wDf2w5YgmVYKqiLUMML5mzFK2Ej1QAmPj+LERKzeaf8et4CKFASNINUQCa9bk2xopZzJRMLQ+5AMZRspy/MM5+c9LBXC0CQUQqMTo/TToAuqenZ8tzGT41xP265O12RkM2c64zqOQOI6nE4QV0QQUWrRWoywgm23ivX4SSKZdjuyY6G0cLdmBxemCRvOwvDmYZjIi+uZcKcyQwj4GZ5lFJkPSKzk54szwz7rt5sdITtA4UTCbfsCUyBPp4HRC3FGBRKkJUKvlYYGkok5heP9CqRlIaDQnoCi0CmvLNCsAiEDYSolBfz/uyTB2EApC8PJRJk+UUAapGxiRQQUEeu9UGvLZyA1XbNwCY1nR84MUt0YZ0S3O5vNurK8Sze63BzDsO4nmpuSUjdMA2pSF91cmUaF1JUgWWUiERMHglSOpCHZXOuiQq0Nja0NyWhnW8tjDfGJFJ7iWWi69B+QJqFkQDyz0NX2+uJaXT7SnAHZ1Zlo2Id7wrl0exRr7dFkgO9rrXOv7lqnxXMoFiwNvKRnYEJXkZT/txiwz/rtscAbcgIYOB+x8mSchKpKfiXBNW24MyvU9nqTGAAZ5LIPnUvS024dkNvbFnUWPHabBLsLaX3kvOpG3nnra4Ak6RZ5DW59hWKpClJV+2ooiWoDysgg91qnZaCZxXgrlHRDNjsj+c5mgFR6fByhgQxStIdWsCVpPSWBD2cysXTawiClwpg8s+B7vbxfKBnd34MiZ333fx3XiThKXoX2ewSJvIdexu8NSLxXkEvCXQ/7ZlowGRb6fH4W0LwkB2gPqcJpv9fDkiEb4JSUTAqCVEmYEZhhTyMrMD6G9zECXxKuOhWRG27m1TVR3cTwltN0mqCoqPtLUe+e2lqHygofO+j4iBl07CfdOaGVZmuZFdUVayor7qZMhKHLBJqc0nMuUgi6TNSlkc7RgK5emM8AZJRXO9CpE9KVoqZ+Rwdz/2RbP6eCnVvU4zNLrs9UsQsWzuMYlmMEjuW9LN/OLLs+W8neV3nPx33L9jg7Frc9ONRzpLwDjm5YtVdl5k0qORxVZZWDjjLti/jlWWvrm1JfbV99cv2vg3jh5d2bP9u4vnnPogNo33nq/dHDZ69WxNktO196yrH/dGB7+ylqUcejz1KbR747UDXqHHmjfPT87j+En7adrLuId7bPHmr0Dr94b+65kXPnth5/OHfG+8vr3teWZvs/AU9GmrZde6RfeODtV35cfulsYsGHx45Gu8798OmlC/Dzo8rJ+bXby45fe7Nv19Jjw4eqsu+d/XK0/2v5rZre5Ttrms1nZm/ZFB1ydJ9ZtHXXCoHJnX51SIw8jx7a9/LIpm+vHPxgr3T+53drvpGWbrjUI36f3nXx4IbL1u9XVUfXO+ma/iOBw3dVUo4TnuH5h5ozw0s2cquOcmuGWqSxMP4Jrxo8em4RAAA=';

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
const axios = require('axios');
const qs = require('qs');
const coder = require('./coder');

module.exports = class Auth {
    static token;

    static async getToken() {
        Auth.token = 'v^1.1#i^1#r^0#f^0#p^3#I^3#t^H4sIAAAAAAAAAOVXbWwURRjutXcltSIRLZIqcFlMRHDvZndvb+9W7uDaXukJvdZeC1KD7dzubNl2b/eyO9f2JMGmKCbGmIg/AIOkIVAlyochMeGrSeMfvwghYlBC/CEqYgglBBWNEWevLVyrAuEwNnH/bGbmnXee53nfeWcG9JWWLdxYt/GX6Y5pxQN9oK/Y4WDKQVmpa9F9JcWVriKQZ+AY6Hu0z9lf8sNiC6a0tNiErLShW8jdm9J0S8x1hqiMqYsGtFRL1GEKWSKWxESkfoXIeoCYNg1sSIZGuWM1IcrHJhUoBZI+FGBlICRJrz7us9kIUawgsDAp8D6/gIAAIRm3rAyK6RaGOibjgAU0w9LA18zwIsOJbMAD/Ewr5V6JTEs1dGLiAVQ4B1fMzTXzsN4cKrQsZGLihArHIrWJhkisJhpvXuzN8xUe0yGBIc5YE1vVhozcK6GWQTdfxspZi4mMJCHLorzh0RUmOhUj42DuAH5OasYXAIzMMzLL+6DsR3dFylrDTEF8cxx2jyrTSs5URDpWcfZWihI1kp1IwmOtOHERq3Hbv6czUFMVFZkhKloVWd2SiDZR7kRjo2l0qzKSc0w5DrABzsdQYYwsIiEy27Caeh52IM3oGVtt1OWY1pOWqzZ0WbWVs9xxA1chAh1NFgjkCUSMGvQGM6JgG1a+nTAuJC+02pEdDWUGr9Xt4KIUUcOda946DON5cSMT7lZmyAziZY4FAucLKlAJ5GeGvdfvNDvCdoAijY1eGwtKwiydgmYXwmkNSoiWiLyZFDJVWeR4heUCCqJlf1ChCQiFTvKyn2YUhABCyaQUDPzvkgRjU01mMLqeKJMHckxDlC2sqEJFxEYX0puzaURNtswVobHs6LVC1FqM06LX29PT4+nhPIbZ4WUBYLzP1K9ISGtRilTZcVv11sa0mktdiRQUYi9iAiBE9ZI0JIvrHVS4KVrbFE3UtTU3LI/Gx1N4ArLw5N5/YJpAkonw1GK3qEuI69XZqvo07FmWrosIuDPSm2qtw3prXSLIdTdVe5d1rNbjvWosVBh5yUijRkNTpey/pYC91+9MBc6UG6GJs1WZLGknkKaRX0F0LZvu1Aq1Pd8iDmBa9dibziMZKa8BSfW2u9pyiL0W4e5R9W6yXw0z6779OVCSjAw5DW5/hpLRFFXT7NJQkNQmklWT1LW2jKlOLcWbkGSYstVWlW2rh6pGj7WraCjDJO2jFZyR9M6CyEfS6VgqlcEwqaGYPLXo8zwX8BfM7u9Jkb3+9n8d1/E4SrxCB3x+iZyHPAjwQYnj/XJBvGtQ91QLJmCQIAQYSHOSHKR9fh9HB3gfQ5pMkFWSMrkQJAvirMIpdjQyfiAATgB+riBe1ZpKKtzUu9fUGRZGt52mkzryLnV/udR7Jz6tw0W5j+l3HAX9joPkdU5kpZlF4PHSkhZnyb2UpWLksaAuJ41eD7kIeiy1QycvRxN5ulA2DVWzuNShnj4pXc171A+sAbOvP+vLSpjyvDc+eOTGiIuZ8dB0FjAs8DE8w7GBVjD/xqiTmeV88MgF9cSBBzZc3tZZvPNUuL3r9aEZV8D060YOh6vI2e8oWnpJb/+U/mLHxhPOWPkuJlB97J65m5f+9vXHs9Z8OzwsHznx0wevDby1f8HW7W9seWr5l5VD8ePR9l39g6s2bRnqPtV//6+HPis+VzlnoPPg8aHylvOz19dzh+ZeXXpt1SW14qPhh39sm9mz5+x3OwYP/7xhYc/I5q0vrkzE14+8uoeV/TN27os6t+11vjdPLRNrtu+7TP3+RMMLs1/+0JHRh2PBkaMVrqxn0+CZ1ncuviKeWyZVNKx21a9Zt2TJk67Epo7twcc+PzA4lK3Ye62q8vDJC7v/2F2/n1rw3NlPhGm9xV+NzDp15XtXzXz0piFr9MIzrovnX5xX2zLzm6Nznt317uljL7UPrns/sW3VaBj/BOhK3ERuEQAA';

        if (!Auth.token) {
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

        return axios.post(url, payload, config);
    }
};
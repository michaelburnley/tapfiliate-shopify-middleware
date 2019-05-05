const axios = require('axios');
const qs = require('qs');

const data = {
    "grant_type": "client_credentials",
};

const auth = {
    username: process.env.PAYPAL_CLIENT_ID,
    password: process.env.PAYPAL_SECRET
};


module.exports = () => {
    return new Promise((resolve) => {
        axios({
            method: `post`,
            url: `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Accept-Language": "en_US"
            },
            withCredentials: true,
            data: qs.stringify(data),
            auth: auth,
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch(err => console.log(err.message));
    });
}
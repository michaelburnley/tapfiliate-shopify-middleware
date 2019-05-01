const axios = require('axios');
const _ = require('lodash');
const error = require('../helpers/error');

const paypal = axios.create({
    baseURL: process.env.PAYPAL_API_URL,
    timeout: 5000,
    headers: {
        "Api-Key": process.env.TAPFILIATE_API_KEY,
        "Content-Type": "application/json"
    }
});
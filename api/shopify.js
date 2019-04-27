const Shopify = require('shopify-api-node'); 
const moment = require('moment');

const shopify = new Shopify({
    shopName: process.env.STORE_NAME,
    apiKey: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_API_PASSWORD
});

const getOrders = async () => {
    return new Promise((resolve, reject) => {
        shopify.order.list({
            limit: 250,
            created_at_min: moment().subtract(1, 'day').format(),
            created_at_max: moment().format(),
            financial_status: `paid`
        })
        .then((data) => {
            return resolve(data);
        });
    });
};

module.exports = {
    getOrders
};
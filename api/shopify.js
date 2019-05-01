const Shopify = require('shopify-api-node'); 
const moment = require('moment');

const shopify = new Shopify({
    shopName: process.env.STORE_NAME,
    apiKey: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_API_PASSWORD
});

// const getPriceRules = async () => {

//     return new Promise((resolve) => {
//         const price = await shopify.priceRule.list({
//             limit: 250,
//         });
        
//     });
// };

// const getCoupons = async (price_rule) => {
//     const coupons = [];
    
// };

const getOrders = async () => {
    const orders = [];

    const order_count = await shopify.order.count({
        created_at_min: moment().subtract(1, 'day').format(),
        created_at_max: moment().format(),
        financial_status: `paid`
    });

    let page = Math.ceil(order_count / 250);

    return new Promise( async (resolve) => {
        while(page > 0) {
            const shopify_orders = await shopify.order.list({
                limit: 250,
                created_at_min: moment().subtract(1, 'day').format(),
                created_at_max: moment().format(),
                financial_status: `paid`,
                page
            });
            orders.push(...shopify_orders)
            --page;
        }
        return resolve(orders);
    });    
};

module.exports = async () => {
    const orders = [];

    const order_count = await shopify.order.count({
        created_at_min: moment().subtract(1, 'day').format(),
        created_at_max: moment().format(),
        financial_status: `paid`
    });

    let page = Math.ceil(order_count / 250);

    return new Promise( async (resolve) => {
        while(page > 0) {
            const shopify_orders = await shopify.order.list({
                limit: 250,
                created_at_min: moment().subtract(1, 'day').format(),
                created_at_max: moment().format(),
                financial_status: `paid`,
                page
            });
            orders.push(...shopify_orders)
            --page;
        }
        return resolve(orders);
    });
};
const dotenv = require('dotenv').config();
const cron = require('node-cron');
const { 
        getPrograms,
        listAffiliatesInProgram,
        conversionExists,
        createConversion
} = require('./api/tapfiliate');
const getOrdersFromShopify = require('./api/shopify');
const _ = require('lodash');

//TODO: Set cron to run every day at 2am

module.exports = async () => {
    console.log(`Running Tapfiliate job.`);

    const affiliate_arr = [];
    const order_arr = [];
    let processed = 0;

    const programs = await getPrograms();
    const orders = await getOrdersFromShopify();

    for (const program of programs) {
        let affiliates = await listAffiliatesInProgram(program);
        const filtered_affiliates = _.filter(affiliates, ({ coupon }) => {
            return !_.isEmpty(coupon);
        });
        console.log(`${filtered_affiliates.length} affiliates added.`)
        affiliate_arr.push(...filtered_affiliates);
    }
    
    const filtered_orders = _.filter(orders, ({ discount_codes }) => {
        return !_.isEmpty(discount_codes);
    });

    for (const order of filtered_orders) {
        const doesConversionExist = await conversionExists(order.order_number)
        _.isEmpty(doesConversionExist) ? order_arr.push(order) : console.log(`Order ${order.order_number} exists as conversion.`);
    }
    
    console.log(`Checking ${order_arr.length} new orders for commission upload.`)

    _.each(affiliate_arr, (affiliate) => {

        const orders = _.find(order_arr, (order) => {
            const affiliate_coupon = affiliate.coupon.toUpperCase();
            const order_coupon = order.discount_codes[0].code.toUpperCase();
            return affiliate_coupon === order_coupon;
        });
        
        if(!orders) {
            return;
        }

        const {
            order_number,
            subtotal_price,
            discount_codes
        } = orders;
        console.log(`Adding order ${order_number} to ${affiliate.id} commissions.`)
        createConversion(order_number, affiliate.id, subtotal_price, discount_codes[0].code);
        processed++;
    });

    console.log(`Finished job. ${processed} orders processed.`)
}
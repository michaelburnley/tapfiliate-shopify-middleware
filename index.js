const dotenv = require('dotenv').config();
const cron = require('node-cron');
const { getPrograms, listAffiliatesInProgram } = require('./api/tapfiliate');
const { getOrders } = require('./api/shopify');
const _ = require('lodash');

//TODO: Check if conversion already exists in tapfiliate
//TODO: Add conversion to tapfiliate
//TODO: Set cron to run every day at 2am

module.exports = async () => {
    const orders_arr = [];
    const affiliate_arr = [];
    const programs = await getPrograms();
    _.each(programs, async (program) => {
        let affiliates = await listAffiliatesInProgram(program);
        affiliate_arr.push(...affiliates);
    })
    const orders = await getOrders();
    
    const filtered_orders = _.filter(orders, ({ discount_codes }) => {
        return !_.isEmpty(discount_codes);
    });


    const programs = await getPrograms();
    _.each(programs, async (program) => {
        let affiliates = await listAffiliatesInProgram(program);
        console.log(affiliates[0]);
    })
}
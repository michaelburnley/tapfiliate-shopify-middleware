const dotenv = require('dotenv').config();
const cron = require('node-cron');
const tapfiliate = require('./api/tapfiliate');
const processPayments = require('./api/payments');
const _ = require('lodash');

//TODO: Set cron to run every day at 2am

module.exports = async () => {
    await tapfiliate();
    await processPayments();
}
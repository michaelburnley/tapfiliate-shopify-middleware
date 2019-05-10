const dotenv = require('dotenv').config();
const cron = require('node-cron');
const tapfiliate = require('./api/tapfiliate');
const processPayments = require('./api/payments');

//TODO: Set cron to run every day at 2am


cron.schedule('0 2 * * *', async () => {
    await tapfiliate();
});

cron.schedule('0 8 15 * *', async () => {
    await processPayments();
});
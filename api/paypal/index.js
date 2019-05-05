const axios = require('axios');
const _ = require('lodash');
const getAccessToken = require('./getAccessToken');
const moment = require('moment');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': '',
}

module.exports = async (payouts) => {
    if(!headers.Authorization) {
        const {
            token_type,
            access_token
        } = await getAccessToken();
        headers.Authorization = `${token_type} ${access_token}`;
    }

    const paypal = await axios.create({
        baseURL: process.env.PAYPAL_API_URL,
        timeout: 5000,
        headers
    })
    .catch(err => console.log(err.message));

    if(!paypal) {
        console.log(`Failed to create Paypal API link.`)
        return;
    }

    const sender_batch_header = {
        "sender_batch_id": `Payouts_${moment.format()}`,
        "email_subject": `You have a payout from ${process.env.STORE_NAME}!`,
        "email_message": "You have received a payout! Thanks for being a part of the ${process.env.STORE_NAME} affiliate family."
    };

    const items = [];
    
    _.each(payouts, (payout) => {
        items.push({
            recipient_type: 'EMAIL',
            amount: {
                value: payout.amount,
                currency: payout.currency
            },
            note: 'Thank you for your hard work!',
            receiver: payout.email,
        });
    });
    
    paypal.post('/v1/payments/payouts', {
        sender_batch_header,
        items
    })
    .then(({
        payout_batch_id,
        batch_status
    }) => {
        console.log(`Payout processed: ${payout_batch_id}`);
        console.log(`Batch Status: ${batch_status}`);
    });

    return items;
};
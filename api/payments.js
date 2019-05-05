const processPayments = require('./paypal');
const _ = require('lodash');
const {
    getAllBalances,
    createPayments,
    getAffiliate
} = require('./tapfiliate/tapfiliate');

module.exports = async () => {
    const payouts = [];
    const pendingBalances = await getAllBalances();

    for (const balance of pendingBalances) {
        const affiliate = await getAffiliate(balance.affiliate_id);
        payouts.push({
            email: affiliate.email,
            amount: balance.balances.USD,
            currency: 'USD'
        });
    }

    await processPayments(payouts);

    const processedBalances = [];

    _.each(pendingBalances, (balance) => {
        processedBalances.push({
            affiliate_id: balance.affiliate_id,
            amount: balance.balances.USD,
            currency: 'USD'
        });
    });

    await createPayments(processedBalances);
};
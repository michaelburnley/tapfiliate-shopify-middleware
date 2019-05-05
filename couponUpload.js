const tapfiliate = require('./api/tapfiliate/tapfiliate');
const shopify = require('./api/shopify');

module.exports = async () => {
    const programs = await tapfiliate.getPrograms();
    
};
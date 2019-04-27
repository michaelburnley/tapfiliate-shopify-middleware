# Tapfiliate Shopify Middleware

Solves the issue of connecting coupon code usage to conversions that were not made through an affiliate link.

Checks shopify orders daily and if affiliate order does not exist, creates it in Tapfiliate.

## Variables for deployment

- SHOPIFY_API_KEY
- SHOPIFY_API_PASSWORD
- TAPFILIATE_API_KEY
- STORE_NAME
- CRON_SCHEDULE

## Modules Used

- [Lodash](https://lodash.com)
- [shopify-api-node](https://www.npmjs.com/package/shopify-api-node)
- [axios](https://www.npmjs.com/package/axios)
- [moment](https://momentjs.com/)
- [node-cron](https://www.npmjs.com/package/node-cron)
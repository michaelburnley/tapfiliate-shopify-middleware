# Tapfiliate Shopify Middleware

Solves the issue of connecting coupon code usage to conversions that were not made through an affiliate link.

Checks shopify orders daily and if affiliate order does not exist, creates it in Tapfiliate.

Automates all processes for the affiliate program including processing payments via PayPal Payouts.

## Variables for deployment

- SHOPIFY_API_KEY
- SHOPIFY_API_PASSWORD
- TAPFILIATE_API_KEY
- STORE_NAME
- CRON_SCHEDULE
- PAYPAL_SANDBOX_API
- PAYPAL_CLIENT_ID
- PAYPAL_SECRET
- PAYPAL_ACCOUNT

## APIs
- Shopify
- Tapfiliate
- Paypal

## Modules Used

- [Lodash](https://lodash.com)
- [shopify-api-node](https://www.npmjs.com/package/shopify-api-node)
- [axios](https://www.npmjs.com/package/axios)
- [moment](https://momentjs.com/)
- [node-cron](https://www.npmjs.com/package/node-cron)
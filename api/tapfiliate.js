const axios = require('axios');
const _ = require('lodash');

const tapfiliate = axios.create({
    baseURL: "https://api.tapfiliate.com/1.6/",
    timeout: 5000,
    headers: {
        "Api-Key": process.env.TAPFILIATE_API_KEY,
        "Content-Type": "application/json"
    }
});

const getAffiliates = (page) => {
    return new Promise((resolve, reject) => {
        tapfiliate.get(`/affiliates/?page=${page}`)
        .then(({data}) => {
            return resolve(data);
        })
        .catch((err) => {
            console.log(err.message);
            reject(err);
        })
    });
}

const getAffiliatesCount = async (url) => {
    return new Promise((resolve, reject) => {
        tapfiliate.get(url)
        .then(async ({ headers }) => {
            let link_strings = headers.link.split(',');
            let pages = link_strings[1].substring(link_strings[1].indexOf('page'));
            let count = parseInt(pages.replace('>; rel=\"last\"', '').replace('page=', ''));
            return resolve(count);
        })
        .catch((err) => {
            console.log(err.message);
            reject(err);
        });
    })
};

const listAffiliatesInProgram = async (program_id) => {
    let url = `/programs/${program_id}/affiliates`;
    let pages = await getAffiliatesCount(url);
    const arr = [];
    return new Promise(async (resolve, reject) => {
        for(i = 1; i < pages + 1; i++) {
            await tapfiliate.get(`${url}/?page=${i}`)
            .then(({data}) => {
                arr.push(...data);
            })
            .catch((err) => {
                console.log(err.message);
                reject(err);
            })
        }
        return resolve(arr);
    });    
}

const getPrograms = () => {
    return new Promise((resolve, reject) => {
        tapfiliate.get(`/programs`)
        .then(({ data }) => {
            const arr = [];
            _.each(data, ({ id }) => {
                arr.push(id);
            })
            return resolve(arr);
        })
        .catch((err) => {
            console.log(err.message);
            reject(err);
        })
    });
};

const listAffiliates = async () => {
    let arr = [];
    return new Promise((resolve, reject) => {
        tapfiliate.get(`/affiliates`)
        .then(async ({ headers }) => {
            let link_strings = headers.link.split(',');
            let pages = link_strings[1].substring(link_strings[1].indexOf('page'));
            pages = parseInt(pages.replace('>; rel=\"last\"', '').replace('page=', ''));
            for(i = 1; i < pages + 1; i++) {
                let data = await getAffiliates(pages);
                arr.push(...data);
            }
        })
        .catch((err) => {
            console.log(err);
            reject(err);
        });

        return resolve(arr);
    })
}

const listCommissions = async (affiliate_id) => {
    return new Promise((resolve, reject) => {
        tapfiliate.get(`/commissions/?affiliate_id=${affiliate_id}`)
        .then(({ data }) => {
            console.log(`${data.length} commissions found for affiliate id: ${affiliate_id}.`);
            return resolve(data);
        })
        .catch((err) => {
            console.log(err.message);
            reject(err);
        });
    });
};

const conversionExists = async (order_id) => {
    let url = `/conversions/?external_id=${order_id}`;

    return new Promise((resolve, reject) => {
        tapfiliate.get(url)
        .then(({ data }) => {
            return resolve(data);
        })
        .catch((err) => {
            console.log(err.message);
            reject(err);
        })
    });    
};

const createConversion = (external_id, referral_code, amount, coupon) => {
    tapfiliate.post('/conversions/', {
        referral_code,
        amount,
        external_id,
        coupon
    })
    .then(() => {
        console.log(`Created conversion for affiliate ${referral_code} for ${external_id}.`)
    })
    .catch((err) => {
        console.log(err.message);
    });
};

module.exports = {
    getAffiliates,
    listAffiliates,
    getPrograms,
    listAffiliatesInProgram,
    listCommissions,
    conversionExists,
    createConversion
}
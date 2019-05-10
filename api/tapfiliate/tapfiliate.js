const axios = require('axios');
const _ = require('lodash');
const error = require('../../helpers/error');

const tapfiliate = axios.create({
    baseURL: process.env.TAPFILIATE_API_URL,
    timeout: 5000,
    headers: {
        "Api-Key": process.env.TAPFILIATE_API_KEY,
        "Content-Type": "application/json"
    }
});

const createPayments = (payments) => {
    return new Promise((resolve) => {
        tapfiliate.post('/payments', payments)
        .then(() => {
            console.log(`Payments updated in Tapfiliate.`)
            resolve();
        })
        .catch(error);
    });
}

const getAllBalances = () => {
    return new Promise((resolve) => {
        tapfiliate.get('/balances')
        .then(({ data }) => {
            return resolve(data);
        })
        .catch(error);
    });
};

const getAffiliate = (id) => {
    return new Promise((resolve) => {
        tapfiliate.get(`/affiliates/${id}`)
        .then(({data}) => {
            return resolve(data);
        })
        .catch(error);
    })
};

const getAffiliates = (page) => {
    return new Promise((resolve) => {
        tapfiliate.get(`/affiliates/?page=${page}`)
        .then(({data}) => {
            return resolve(data);
        })
        .catch(error)
    });
}

const getPageCount = async (url) => {
    return new Promise((resolve) => {
        tapfiliate.get(url)
        .then(async ({ headers }) => {
            let link_strings = headers.link.split(',');
            let pages = link_strings[1].substring(link_strings[1].indexOf('page'));
            let count = parseInt(pages.replace('>; rel=\"last\"', '').replace('page=', ''));
            return resolve(count);
        })
        .catch(error);
    })
};

const listAffiliatesInProgram = async (program_id) => {
    let url = `/programs/${program_id}/affiliates`;
    let pages = await getPageCount(url);
    const arr = [];
    return new Promise(async (resolve) => {
        for(i = 1; i < pages + 1; i++) {
            await tapfiliate.get(`${url}/?page=${i}`)
            .then(({data}) => {
                arr.push(...data);
            })
            .catch(error);
        }
        return resolve(arr);
    });    
}

const getPrograms = () => {
    return new Promise((resolve) => {
        tapfiliate.get(`/programs`)
        .then(({ data }) => {
            const arr = [];
            _.each(data, ({ id }) => {
                arr.push(id);
            })
            return resolve(arr);
        })
        .catch(error)
    });
};

const listAffiliates = async () => {
    let arr = [];
    return new Promise((resolve) => {
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
        .catch(error);

        return resolve(arr);
    })
}

const listCommissions = async (affiliate_id) => {
    return new Promise((resolve) => {
        tapfiliate.get(`/commissions/?affiliate_id=${affiliate_id}`)
        .then(({ data }) => {
            console.log(`${data.length} commissions found for affiliate id: ${affiliate_id}.`);
            return resolve(data);
        })
        .catch(error);
    });
};

const conversionExists = async (order_id) => {
    let url = `/conversions/?external_id=${order_id}`;

    return new Promise((resolve) => {
        tapfiliate.get(url)
        .then(({ data }) => {
            return resolve(data);
        })
        .catch(error)
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
    .catch(error);
};

module.exports = {
    getAffiliate,
    getAllBalances,
    getAffiliates,
    listAffiliates,
    getPrograms,
    listAffiliatesInProgram,
    listCommissions,
    conversionExists,
    createConversion
}
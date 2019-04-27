const axios = require('axios');
const _ = require('lodash');

const tapfiliate = axios.create({
    baseURL: "https://api.tapfiliate.com/1.6/",
    timeout: 2000,
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
    let count;
    return new Promise((resolve, reject) => {
        tapfiliate.get(url)
        .then(async ({ headers }) => {
            let link_strings = headers.link.split(',');
            pages = link_strings[1].substring(link_strings[1].indexOf('page'));
            count = parseInt(pages.replace('>; rel=\"last\"', '').replace('page=', ''));
            return resolve(count);
        });
    })
};

const listAffiliatesInProgram = async (program_id) => {
    let url = `/programs/${program_id}/affiliates`;
    let pages = await getAffiliatesCount(url);
    const arr = [];
    return new Promise(async (resolve, reject) => {
        for(i = 1; i < pages + 1; i++) {
            await tapfiliate.get(`${url}/?pages=${pages}`)
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
    await tapfiliate.get(`/affiliates`)
    .then(async ({ headers }) => {
        let link_strings = headers.link.split(',');
        let pages = link_strings[1].substring(link_strings[1].indexOf('page'));
        pages = parseInt(pages.replace('>; rel=\"last\"', '').replace('page=', ''));
        for(i = 1; i < pages + 1; i++) {
            let data = await getAffiliates(pages);
            arr.push(...data);
        }
    });

    return arr;
}

const createConversion = async (coupon, amount) => {
    await tapfiliate.post('/conversion', {
        coupon,
        amount
    })
    .then((response) => {
        console.log(response);
    });
};

module.exports = {
    getAffiliates,
    listAffiliates,
    getPrograms,
    listAffiliatesInProgram
}
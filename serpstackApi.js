const axios = require('axios');
const mockResponse = require('./fixtures/mockShaheenResponse.js');
const { getMetaProperties } = require('./parseMissing.js');

const apiKey = '8ddb0998709a870c84eed7567752dfe8';


async function serpstackSearch(searchText, mock = false) {
    if (mock) return mockResponse;

    console.log(`searching for "${ searchText }"`);
    const { data } = await axios('http://api.serpstack.com/search', {
        params: {
            access_key: apiKey,
            query: searchText,
            type: 'news',
            period: 'last_day'
        }
    });
    // console.log(data);
    if (!data.request.success) {
        throw new Error(data.error.info);
    }

    return data.news_results;
}

exports = module.exports = serpstackSearch;

async function run(query) {
    // get the raw results from serpStack
    const results = await serpstackSearch(query, true);

    const infoArray = [];

    // resolve/fix missing serpStack data
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        const { title, url, source_name } = result;

        const resultInfo = { title, /*url,*/ source: source_name };
        // scrape the meta tags from the url, only if it needs to be fixed
        let props;
        if (!title || title.endsWith('...')) {
            props = await getMetaProperties(url);
            resultInfo.title = props.title;
            resultInfo.source = source_name || props.site_name;
            resultInfo.fixed = (resultInfo.title && resultInfo.source) && true || false;
        }
        // console.log(i, resultInfo);
        infoArray.push(resultInfo);
    }

    return infoArray;
}

run('Jeanne Shaheen');

module.exports = run;
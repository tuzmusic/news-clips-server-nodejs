const axios = require('axios');
const mockResponse = require('./fixtures/mockShaheenResponse.js');
const { getMetaProperties } = require('./getMetaProperties.js');

const apiKey = '8ddb0998709a870c84eed7567752dfe8';


async function serpstackSearch(searchText, mock = false) {
    // TODO: get mock as boolean instead of string!!!
    if (mock === 'true') {
        console.log('USING MOCK RESULTS FOR "Jeanne Shaheen"');
        return mockResponse;
    }

    console.log(`searching for "${ searchText }"`);
    const { data } = await axios('http://api.serpstack.com/search', {
        params: {
            access_key: apiKey,
            query: searchText,
            type: 'news',
            period: 'last_day'
        }
    });
    // TODO: Does this make sense? It was copied directly from the preact implementation.
    if (!data.request.success) {
        throw new Error(data.error.info);
    }

    return data.news_results;
}

async function run(query, { log, mock }) {
    // get the raw results from serpStack
    const results = await serpstackSearch(query, mock);

    const infoArray = [];

    // resolve/fix missing serpStack data
    for (const result of results) {
        const { title, url, source_name } = result;

        const resultInfo = { title, url, source: source_name };

        // scrape the meta tags from the url, only if it needs to be fixed
        if (!title || title.endsWith('...')) {
            const props = await getMetaProperties(url);
            resultInfo.title = props.title;
            resultInfo.source = source_name || props.site_name;
            resultInfo.fixed = (resultInfo.title && resultInfo.source) && true || false;
        }
        if (log) console.log(infoArray.length, resultInfo);

        infoArray.push(resultInfo);
    }
    return infoArray;
}

// run('Jeanne Shaheen', ({ mock: true, log: true }));

module.exports = run;
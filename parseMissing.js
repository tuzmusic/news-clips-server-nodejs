const request = require('request');
const cheerio = require('cheerio');
const serp = require('./fixtures/mockSerpstackApiResponse.js');
const results = serp.mockSerpstackApi();
const urls = require('./fixtures/justUrls.js');

// parseTitlesFromResults();
parsePropertiesFromUrls();

async function parsePropertiesFromUrls() {
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        if (!url.title) {
            // const props = await getMetaProperties(url);
            // console.log(`Title: ${ props.title }`);
            // console.log(`Source: ${ props.site_name }`);
            // console.log();
        }
    }
}

async function parseTitlesFromResults() {
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.title) {
            const props = await getMetaProperties(result.url);
            console.log(props);
        }
    }
}

function asyncRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error) reject(error);
            resolve({ response, html });
        });
    });
}

async function getMetaProperties(url) {
    const { html } = await asyncRequest(url);
    const $ = cheerio.load(html);

    const metaNodes = $('meta');

    const properties = {};
    for (let j = 0; j < metaNodes.length; j++) {
        const attr = metaNodes[j].attribs;
        if (attr.property) {
            properties[attr.property.split(':')[1]] = attr.content;
        }
    }
    return properties;
}

module.exports = { getMetaProperties };
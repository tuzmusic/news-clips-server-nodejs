const request = require('request');
const cheerio = require('cheerio');

// Async version of request function
function asyncRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error) reject(error);
            resolve({ response, html });
        });
    });
}

async function getMetaProperties(url) {
    let scraped;
    try { // fetch the page (asynchronously)
        const { html } = await asyncRequest(url);
        scraped = html;
    } catch (e) {
        // if there's a redirect issue (or any other issue I guess) we'll go here,
        // allowing the link text to just be the url
        return {
            title: url,
            site_name: 'ERROR FETCHING ARTICLE'
        };
    }

    // scrape/parse the page (synchronously)
    const $ = cheerio.load(scraped);

    // get all meta tags from the page
    const metaNodes = $('meta');

    const properties = {};

    // go through the meta nodes and get potentially relevant properties.
    // note: cheerio results aren't iterable so you can't do forof
    for (let j = 0; j < metaNodes.length; j++) {
        const attr = metaNodes[j].attribs;
        if (attr.property) {
            properties[attr.property.split(':')[1]] = attr.content;
        }
    }

    return properties;
}

module.exports = { getMetaProperties };
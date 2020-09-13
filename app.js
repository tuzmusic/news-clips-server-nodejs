const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

exports.getGoogleAlertsResultsWithCheerio = (searchText) => {
    const url = 'https://www.google.com/alerts/preview?' +
        'params=%5Bnull%2C%5Bnull%2Cnull%2Cnull%2C%5Bnull%2C%22%5C%22' +
        searchText +
        '%5C%22%22%2C%22com%22%2C%5Bnull%2C%22en%22%2C%22US%22%5D%5D%2Cnull%2C3%2C%5B%5Bnull%2C1%2C%22tuzmusic%40gmail.com%22%2C%5Bnull%2Cnull%2C22%5D%2C2%2C%22en-US%22%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%220%22%2Cnull%2Cnull%2C%22AB2Xq4hcilCERh73EFWJVHXx-io2lhh1EhC8UD8%22%5D%5D%5D%2C0%5D';
    const resultsArray = [];

    request(url, (error, response, html) => {

        // First we'll check to make sure no errors occurred when making the request

        if (error) { return; }
        const $ = cheerio.load(html);

        const results = $('li.result');
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const publicationName = $('.result_source', result).text().trim();

            const link = $('.result_title_link', result);
            const title = link.text();

            const fullUrl = link.attr('href');
            const linkUrl = fullUrl.split('&url=').pop();

            const info = { linkText: title, linkUrl, publicationName };
            resultsArray.push(info);
        }
        console.log(resultsArray);
        return resultsArray;
    });
};

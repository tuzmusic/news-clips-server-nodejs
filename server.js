const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const cors = require('cors');

const serpstackSearch = require('./serpstackApi.js');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const searchText = req.query.query;
});

app.get('/cheerio', async (req, res) => {
    const searchText = req.query.search;
    const url = 'https://www.google.com/alerts/preview?' +
        'params=%5Bnull%2C%5Bnull%2Cnull%2Cnull%2C%5Bnull%2C%22%5C%22' +
        searchText +
        '%5C%22%22%2C%22com%22%2C%5Bnull%2C%22en%22%2C%22US%22%5D%5D%2Cnull%2C3%2C%5B%5Bnull%2C1%2C%22tuzmusic%40gmail.com%22%2C%5Bnull%2Cnull%2C22%5D%2C2%2C%22en-US%22%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%220%22%2Cnull%2Cnull%2C%22AB2Xq4hcilCERh73EFWJVHXx-io2lhh1EhC8UD8%22%5D%5D%5D%2C0%5D';
    const resultsArray = [];

    request(url, (error, response, html) => {
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

            const info = { title, linkUrl, publicationName };
            resultsArray.push(info);
        }
        res.send(resultsArray);
    });
});

app.listen('8081');

console.log('Listening on port 8081');

exports = module.exports = app;
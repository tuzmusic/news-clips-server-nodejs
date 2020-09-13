const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const { Builder, By, Key, until } = require('selenium-webdriver');

const { getGoogleAlertsResultsWithCheerio } = require('./app.js');

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const url = 'https://www.google.com/alerts';
app.get('/selenium', (req, res) => {

    async function getStuff() {
        const webdriver = require('selenium-webdriver');
        const By = webdriver.By;
        const driver = new webdriver.Builder().forBrowser('chrome').build();

        const inputSel = 'label-input-label';
        const searchText = 'Joe Biden';
        driver.get(url);
        driver.findElement(By.className(inputSel)).click();
        driver.findElement(By.className(inputSel)).sendKeys(searchText);
    }


    getStuff().then(result => res.send(result));
    // res.send()
});

app.get('/scrape', (req, res) => {
    // visit google alerts homepage
    // request(url, (err, res, html) => {
    //     if (err) {
    //         console.log('There was an error. Exiting.');
    //         return;
    //     }
    //
    //     // load the html from the result
    //     const content = cheerio.load(html);
    //     return content
    // });
    console.log(`scrape`);
    res.send('scrape');
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

            const info = { linkText: title, linkUrl, publicationName };
            resultsArray.push(info);
        }
        // console.log(resultsArray);
        res.send(resultsArray);
    });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
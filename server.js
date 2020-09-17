const express = require('express');
const cors = require('cors');
const scrape = require('./serpstackApi.js');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const { searchText, mock } = req.query;
    const results = await scrape(searchText, { mock, log: true });
    res.send(results);
});

app.listen('8081');

console.log('Listening on port 8081');

exports = module.exports = app;
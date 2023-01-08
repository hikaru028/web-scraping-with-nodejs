const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const port = 3000;

const app = express();

//To scrape data on eBay (a commerce website)
const URL = "https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313.TR12.TRC2.A0.H0.TRS0&_nkw=Apple&_sacat=0&LH_TitleDesc=0&_osacat=0&_odkw=Apple";
const data = [];

axios(URL).then((response) => {
    const htmlParser = response.data;

    const $ = cheerio.load(htmlParser);

    $(".s-item__wrapper", htmlParser).each(function() {
        const title = $(this).find(".s-item__title").text();
        const price = $(this).find(".s-item__price").text();

        data.push({title, price});
        console.log(data);
    });

}).catch((error) => console.log(error));

app.listen(port, console.log("Server running!"));
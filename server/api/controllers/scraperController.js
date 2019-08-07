'use strict';
const mongoose = require('mongoose');
const Item = mongoose.model('Item');

const puppeteer = require('puppeteer');

exports.scrapePage = (req, res) => {
  let url = req.body.url;
  scraper(url).then(value => {
    console.log(value);
  });
};

let scrape = async () => {
  return 'test';
};

let scraper = async (url) => {
  console.log('Accessing Amazon to fetch data');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText;
    let priceStr = document.querySelector('#priceblock_ourprice').innerText;
    let priceInt = parseInt(priceStr.replace(/£/g, ''));
    return {
      title,
      priceInt
    };
  });
  browser.close();
  return result;
}

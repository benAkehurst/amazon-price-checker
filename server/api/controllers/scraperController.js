'use strict';
const mongoose = require('mongoose');
const Item = mongoose.model('Item');

const puppeteer = require('puppeteer');

exports.scrapePage = (req, res) => {
  let url = req.body.url;
  scraper(url)
    .then(data => {
      if (data) {
        // Here I need to put the scraped data in the db
        res.send({
          msg: 'data scraped successfully',
          data: data
        });
      }
    })
    .catch(err => {
      res.send({
        msg: 'Error - something went wrong scraping',
      });
    });
};

let scraper = async url => {
  console.log('Accessing Amazon to fetch data');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Going to chosen URL');
  await page.goto(url);
  await page.waitFor(1000);
  console.log('Scraping information');
  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText;
    let imgUrl = document.querySelector('#imgTagWrapperId > img').src;
    let priceStr = document.querySelector('#priceblock_ourprice').innerText;
    let priceInt = parseInt(priceStr.replace(/£/g, ''));
    return {
      title,
      imgUrl,
      priceInt
    };
  });
  browser.close();
  return result;
};

/**
 * Puppeteer script written by following:
 * https://codeburst.io/a-guide-to-automating-scraping-the-web-with-javascript-chrome-puppeteer-node-js-b18efb9e9921
 */

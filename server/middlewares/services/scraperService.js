const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');

/**
 * Used to scrape the item details using cheerio
 * @param {*} url
 * @returns item : {
 *  asin
 * title
 * price
 * image
 * }
 */
const fetchItemInfoCheerio = async (url) => {
  const result = await axios.get(itemUrl);
  const $ = cheerio.load(result.data);
  const item = {};
  item.asin = itemUrl.split('/')[5];
  $('#ppd').each((i, el) => {
    item.title = $(el)
      .find('#productTitle')
      .text()
      .replace(/\r?\n|\r/g, '');
    item.price = parseFloat(
      $(el)
        .find('.a-price')
        .children('.a-offscreen')
        .text()
        .replace(/\r?\n|\r/g, '')
        .replace(/£/g, '')
    ).toFixed(2);
    item.image = $(el).find('#imgTagWrapperId').children('img').attr('src');
  });
  return item;
};

const puppeteerOptions = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};

/**
 * First used to gather item name, image url and price as an integer
 * @param {*} url
 * @returns {
 *  title,
 *  imgUrl,
 *  priceConverted
 * }
 */
const fetchInitialItemInfo = async (url) => {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor(1000);
  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText;
    let imgUrl = document.querySelector('.imgTagWrapper > img').src;
    let priceStr = document.querySelector('#priceblock_ourprice').innerText;
    let priceConverted = parseInt(priceStr.replace(/£/g, ''));
    return {
      title,
      imgUrl,
      priceConverted,
    };
  });
  await browser.close();
  if (result) {
    return result;
  } else {
    return false;
  }
};

/**
 * Used to check the updated price of an item
 * @param {*} url
 * @returns {
 *  priceConverted
 * }
 */
const fetchCurrentItemPrice = async (url) => {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor(1000);
  const result = await page.evaluate(() => {
    let priceStr = document.querySelector('#priceblock_ourprice').innerText;
    let priceConverted = parseInt(priceStr.replace(/£/g, ''));
    return {
      priceConverted,
    };
  });
  await browser.close();
  return result;
};

module.exports = {
  fetchItemInfoCheerio,
  fetchInitialItemInfo,
  fetchCurrentItemPrice,
};

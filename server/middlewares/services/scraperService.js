const cheerio = require('cheerio');

module.exports = { fetchInitialItemInfo, fetchCurrentItemPrice };

// const puppeteer = require('puppeteer');

// const puppeteerOptions = {
//   headless: true,
//   args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
// };

// /**
//  * First used to gather item name, image url and price as an integer
//  * @param {*} url
//  * @returns {
//  *  title,
//  *  imgUrl,
//  *  priceConverted
//  * }
//  */
// const fetchInitialItemInfo = async (url) => {
//   const browser = await puppeteer.launch(puppeteerOptions);
//   const page = await browser.newPage();
//   await page.goto(url);
//   await page.waitFor(1000);
//   const result = await page.evaluate(() => {
//     let title = document.querySelector('#productTitle').innerText;
//     let imgUrl = document.querySelector('.imgTagWrapper > img').src;
//     let priceStr = document.querySelector('#priceblock_ourprice').innerText;
//     let priceConverted = parseInt(priceStr.replace(/£/g, ''));
//     return {
//       title,
//       imgUrl,
//       priceConverted,
//     };
//   });
//   await browser.close();
//   if (result) {
//     return result;
//   } else {
//     return false;
//   }
// };

// /**
//  * Used to check the updated price of an item
//  * @param {*} url
//  * @returns {
//  *  priceConverted
//  * }
//  */
// const fetchCurrentItemPrice = async (url) => {
//   const browser = await puppeteer.launch(puppeteerOptions);
//   const page = await browser.newPage();
//   await page.goto(url);
//   await page.waitFor(1000);
//   const result = await page.evaluate(() => {
//     let priceStr = document.querySelector('#priceblock_ourprice').innerText;
//     let priceConverted = parseInt(priceStr.replace(/£/g, ''));
//     return {
//       priceConverted,
//     };
//   });
//   await browser.close();
//   return result;
// };

// module.exports = { fetchInitialItemInfo, fetchCurrentItemPrice };

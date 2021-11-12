const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

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
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);
  const item = {};
  item.asin = url.split("/")[5];
  $("#ppd").each((i, el) => {
    item.name = $(el)
      .find("#productTitle")
      .text()
      .replace(/\r?\n|\r/g, "");
    item.price = parseFloat(
      $(el)
        .find(".a-price")
        .children(".a-offscreen")
        .text()
        .replace(/\r?\n|\r/g, "")
        .replace(/£/g, "")
    ).toFixed(2);
    item.image = $(el).find("#imgTagWrapperId").children("img").attr("src");
    item.rating = $(el).find(".a-icon-alt").text();
  });
  return item;
};

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
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
    let priceStr = document.querySelector("#priceblock_ourprice").innerText;
    let priceConverted = parseInt(priceStr.replace(/£/g, ""));
    return {
      priceConverted,
    };
  });
  await browser.close();
  return result;
};

module.exports = {
  fetchItemInfoCheerio,
  fetchCurrentItemPrice,
};

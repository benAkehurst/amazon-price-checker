const cheerio = require("cheerio");
const axios = require("axios");

/**
 * Used to scrape the item details using cheerio
 * @param {*} url
 * @returns item : {
 * asin
 * title
 * price
 * image
 * rating
 * }
 */
const fetchItemInfo = async (url) => {
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
    item.imgUrl = $(el).find("#imgTagWrapperId").children("img").attr("src");
    item.rating = $(el).find(".a-icon-alt").text();
  });
  return item;
};

/**
 * Used to scrape the item details using cheerio
 * @param {*} url
 * @returns item : {
 * price
 * }
 */
const fetchCurrentItemPrice = async (url) => {
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);
  const item = {};
  $("#ppd").each((i, el) => {
    item.price = parseFloat(
      $(el)
        .find(".a-price")
        .children(".a-offscreen")
        .text()
        .replace(/\r?\n|\r/g, "")
        .replace(/£/g, "")
    ).toFixed(2);
  });
  return item;
};

module.exports = {
  fetchItemInfo,
  fetchCurrentItemPrice,
};

'use strict';
const mongoose = require('mongoose');
const Item = mongoose.model('Item');

const puppeteer = require('puppeteer');

exports.scrape_product = (req, res) => {
  let targetUrl = req.body.url;
  Item.find({ link: targetUrl }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    let result = docs;
    if (result.length <= 0) {
      scraper(targetUrl)
        .then(data => {
          if (data) {
            let newItem = new Item({
              name: data.title,
              link: targetUrl,
              imgUrl: data.imgUrl,
              price: data.priceInt
            });
            newItem.save((err, item) => {
              if (err) {
                res.send({
                  error: err,
                  message: "Couldn't create item in DB",
                  code: 400
                });
              };
              res.status(201).json({
                message: 'Item created',
                success: true,
                obj: item
              });
            })
          }
        })
        .catch(err => {
          res.send({
            msg: 'Error - something went wrong scraping'
          });
        });
    }
    if (result.length >= 1) {
      res.send({
        msg: 'Item exists in DB'
      })
    }
  });
};

exports.get_all_items = (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      res.send({
        error: err,
        message: 'No items fround',
        code: 204
      });
    }
    res.send({
      message: 'All items returned',
      data: items,
      code: 200
    });
  });
};

exports.get_single_item = (req, res) => {
  Item.findById(req.params.itemId, (err, item) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't find item",
        code: 400
      });
    }
    res.send({
      message: 'Item found',
      data: item,
      code: 200
    });
  });
};

exports.update_item = (req, res) => {
  // get item from db
  // scrape again
  // update entry
  // save to db
  // return to user
};

exports.delete_item = (req, res) => {
  // find item in db
  // move to deleted collection
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

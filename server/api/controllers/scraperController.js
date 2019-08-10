'use strict';
const mongoose = require('mongoose');
const SingleItem = mongoose.model('SingleItem');
const Items = mongoose.model('Items');

const puppeteer = require('puppeteer');

exports.get_all_items = (req, res) => {
  SingleItem.find({}, (err, items) => {
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
  let id = req.body.id;
  SingleItem.findById(id, (err, item) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't find the requested item",
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

exports.first_scrape = (req, res) => {
  let url = req.body.url;
  scraper(url)
    .then(data => {
      if (data) {
        let newItem = new SingleItem({
          name: data.title,
          link: url,
          imgUrl: data.imgUrl,
          price: data.priceInt
        });
        newItem.save((err, item) => {
          if (err) {
            res.send({
              error: err,
              message: "Couldn't create item in database",
              code: 400
            });
          }
          let itemCollection = new Items({
            uid: item._id
          });
          itemCollection.save();
          res.status(201).json({
            message: 'Item found and saved in database',
            success: true,
            obj: item
          });
        });
      }
    })
    .catch(err => {
      res.send({
        err: err,
        msg: 'Error - something went wrong scraping the item'
      });
    });
};

exports.update_item = (req, res) => {
  let id = req.body.id;
  SingleItem.findById(id, (err, item) => {
    scraper(item.link)
      .then(data => {
        if (data) {
          let newObj = {
            tite: data.title,
            price: data.priceInt,
            date: Date.now().toString()
          };
          SingleItem.findOneAndUpdate(
            { _id: req.body.id },
            { $push: { pastPrices: newObj } },
            (err, result) => {
              if (err) {
                res.send({
                  error: err,
                  message: "Couldn't update item in database",
                  success: false,
                  code: 400
                });
              }
              res.status(200).json({
                message: 'Item updated in database',
                success: true,
                obj: result
              });
            }
          );
        }
      })
      .catch(err => {
        res.send({
          err: err,
          msg: 'Error - something went wrong scraping the item'
        });
      });
  });
};

exports.delete_item = (req, res) => {
  // find item in db
  // move to deleted collection
};

let scraper = async url => {
  console.log('Accessing Amazon to fetch item data');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Going to chosen URL');
  await page.goto(url);
  await page.waitFor(1000);
  console.log('At chosen page \n Starting scrape');
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

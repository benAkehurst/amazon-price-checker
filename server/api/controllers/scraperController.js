'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const SingleItem = mongoose.model('SingleItem');
const Items = mongoose.model('Items');
const Deleted = mongoose.model('Deleted');

const fs = require('fs');
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

exports.get_all_items = (req, res) => {
  console.log('Get All Items Called');
  SingleItem.find({}, (err, items) => {
    if (err) {
      res.send({
        error: err,
        message: 'No items fround',
        code: 204,
        success: false
      });
    }
    res.send({
      message: 'All items returned',
      data: items,
      code: 200,
      success: true
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

exports.get_single_user_items = (req, res) => {
  let userId = req.body.userId;
  SingleItem.find({ users: { $all: [userId] } }, (err, data) => {
    if (err) {
      res.send({
        msg: 'user or items not found',
        success: false
      });
    }
    res.send({
      success: true,
      msg: 'All user Items found',
      data: data
    });
  });
};

exports.get_all_followed_items = (req, res) => {
  SingleItem.find({}, (err, items) => {
    let followedItems = [];
    items.forEach(e => {
      if (e.following === true) {
        followedItems.push(e);
      }
    });
    if (err) {
      res.send({
        msg: 'No followed items',
        success: false,
        error: err
      });
    }
    res.send({
      msg: 'Followed Items',
      success: true,
      data: followedItems
    });
  });
};

exports.first_scrape = (req, res) => {
  let userId = req.body.userId;
  let url = req.body.url;
  let follow = req.body.follow;
  let target = req.body.targetPrice;
  let checkUrl = validURL(url);
  if (!checkUrl) {
    res.send({
      msg: 'You have provided a bad url',
      success: false
    });
    return;
  }
  if (follow === null) {
    follow = false;
  }
  scraper(url)
    .then(data => {
      if (data) {
        let newItem = new SingleItem({
          name: data.title,
          link: url,
          imgUrl: data.imgUrl,
          price: data.priceInt,
          following: follow,
          targetPrice: target,
          users: userId
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
          User.update(
            { _id: userId },
            { $push: { user_items: item._id } },
            (err, done) => {
              if (err) {
                res.send({
                  error: err,
                  message: "Couldn't create item in database",
                  code: 400
                });
              }
            }
          );
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
  let targetPrice = req.body.targetPrice;
  let updatePrice = cron_update_item(id, targetPrice);
  if (updatePrice) {
    res.send({
      success: true,
      message: 'Item updated successfully'
    });
  }
};

exports.change_tracking = (req, res) => {
  let id = req.body.id;
  let follow = req.body.follow;
  SingleItem.findOne({ _id: id }, (err, item) => {
    item.following = follow;
    item.save((err, updatedItem) => {
      if (err) {
        res.send({
          error: err,
          message: "Couldn't update following status",
          success: false
        });
      }
      res.send({
        message: 'Item updated',
        success: true,
        obj: updatedItem
      });
    });
  });
};

exports.delete_item = (req, res) => {
  let userId = req.body.userId;
  let itemId = req.body.itemId;
  // TODO: finish delete item for user array
  console.log(userId, itemId);
  User.updateOne(
    { _id: userId },
    { $pull: { user_items: itemId } },
    (err, done) => {
      if (err) {
        res.send({
          error: err,
          message: "Couldn't create item in database",
          code: 400
        });
      }
    }
  );
  SingleItem.findById(itemId, (err, document) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't find the requested item",
        success: false,
        code: 400
      });
    }
    let newItem = new Deleted({
      item: document
    });
    newItem.save((err, item) => {
      if (err) {
        res.send({
          error: err,
          message: "Couldn't find the requested item",
          success: false,
          code: 400
        });
      }
    });
  });
  SingleItem.findByIdAndRemove(itemId, (err, success) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't find the requested item",
        success: false,
        code: 400
      });
    }
    console.log('Item removed from items db');
  });
  res.send({
    message: 'Item deleted from database',
    success: true
  });
};

let scraper = async url => {
  console.log('Accessing Amazon to fetch item data');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Going to chosen URL');
  await page.goto(url);
  await page.waitFor(1000);
  console.log('At chosen page and starting scrape');
  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText;
    let imgUrl = document.querySelector('#imgTagWrapperId > img').src;
    let priceStr = document.querySelector('#priceblock_ourprice').innerText;
    let priceInt = parseInt(priceStr.replace(/£/g, '').replace(/,/g, ''));
    return {
      title,
      imgUrl,
      priceInt
    };
  });
  browser.close();
  return result;
};

function validURL(str) {
  if (str.indexOf('amazon') > -1) {
    return true;
  }
  return false;
}

cron.schedule('0 */6 * * *', () => {
  SingleItem.find({}, (err, items) => {
    let followedItems = [];
    items.forEach(e => {
      if (e.following === true) {
        followedItems.push(e);
      }
    });
    if (err) {
      console.log({
        error: err,
        msg: 'Failed to update item'
      });
    }
    followedItems.forEach(e => {
      console.log('Updating');
      cron_update_item(e._id, e.targetPrice);
    });
  });
});

let cron_update_item = async (id, targetPrice) => {
  let itemId = id;
  await SingleItem.findById(itemId, (err, item) => {
    scraper(item.link)
      .then(data => {
        if (data) {
          let newObj = {
            tite: data.title,
            price: data.priceInt,
            date: Date.now().toString()
          };
          SingleItem.findOneAndUpdate(
            { _id: itemId },
            { $push: { pastPrices: newObj } },
            (err, result) => {
              if (err) {
                return {
                  success: false,
                  error: err
                };
              }
              if (newObj.price < targetPrice) {
                sendEmail(newObj);
              }
              let log = {
                msg: `Cron Job Run`,
                time: new Date()
              };
              console.log('Scraping item');
              fs.writeFileSync('./logs/cron.json', JSON.stringify(log), {
                encoding: 'utf8',
                flag: 'a'
              });
              return;
            }
          );
        }
      })
      .catch(err => {
        return {
          success: false,
          message: 'Major error',
          error: err
        };
      });
  });
};

function sendEmail(result) {
  const mailOptions = {
    from: process.env.GMAIL_LOGIN,
    to: process.env.GMAIL_LOGIN,
    subject: `AMAZON PRICE TRACK - ${result.title} - PRICE: ${result.priceInt}`,
    html: `<p>The ${result.title} you wanted to buy is now ${
      result.priceInt
    }! Go buy it!!!></p>`
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_LOGIN,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log('Email Sent Successfully');
  });
}

/**
 * Puppeteer script written by following:
 * https://codeburst.io/a-guide-to-automating-scraping-the-web-with-javascript-chrome-puppeteer-node-js-b18efb9e9921
 */

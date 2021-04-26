'use strict';
const User = require('../models/user.model');
const {
  fetchInitialItemInfo,
  fetchCurrentItemPrice,
} = require('../../middlewares/services/scraperService');
const {
  validateAmazonUrl,
  checkToken,
} = require('../../middlewares/validators');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const fs = require('fs');

exports.createInitialItem = async (req, res) => {
  const { token, uniqueId } = req.params;
  const { itemUrl, followItem, targetPrice } = req.body;

  if (!uniqueId || !token || !itemUrl || !followItem || !targetPrice) {
    res.status(400).json({
      success: false,
      message: 'Please provide all data required.',
      data: null,
    });
  } else if (!validateAmazonUrl(itemUrl)) {
    res.status(400).json({
      success: false,
      message: 'Wrong URL format in request.',
      data: null,
    });
  } else {
    try {
      const tokenValid = await checkToken(token);
      const scrapedItem = await fetchInitialItemInfo(itemUrl);

      if (!scrapedItem) {
        res.status(500).json({
          success: false,
          message: 'Scrape of item failed',
          data: null,
        });
      } else if (!tokenValid) {
        res.status(501).json({
          success: false,
          message: 'Token not valid.',
          data: null,
        });
      } else {
        const newSingleItem = {
          name: scrapedItem.title,
          link: itemUrl,
          imgUrl: scrapedItem.imgUrl,
          price: scrapedItem.priceConverted,
          targetPrice: targetPrice,
          following: followItem,
          pastPrices: [],
          itemUniqueId: uuidv4(),
        };
        User.findOneAndUpdate(
          { uniqueId: uniqueId },
          {
            $push: {
              trackedItems: newSingleItem,
            },
          },
          { new: true },
          (err, user) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: 'Failed to scrape item or save item.',
                data: null,
              });
            }
            res.status(201).json({
              success: true,
              message: 'Item tracked and saved successfully.',
              data: user.trackedItems,
            });
          }
        );
      }
    } catch {
      res.status(500).json({
        success: false,
        message: 'Something went wrong fetching initial item details.',
        data: null,
      });
    }
  }
};

// // Get's all items? - whose?
// exports.get_all_items = (req, res) => {
//   console.log('Get All Items Called');
//   SingleItem.find({}, (err, items) => {
//     if (err) {
//       res.send({
//         error: err,
//         message: 'No items fround',
//         code: 204,
//         success: false,
//       });
//     }
//     res.send({
//       message: 'All items returned',
//       data: items,
//       code: 200,
//       success: true,
//     });
//   });
// };

// // gets a single item details?
// exports.get_single_item = (req, res) => {
//   let id = req.body.id;
//   SingleItem.findById(id, (err, item) => {
//     if (err) {
//       res.send({
//         error: err,
//         message: "Couldn't find the requested item",
//         code: 400,
//       });
//     }
//     res.send({
//       message: 'Item found',
//       data: item,
//       code: 200,
//     });
//   });
// };

// // gets the items of a single user
// exports.get_single_user_items = (req, res) => {
//   console.log('In single user items');
//   let userId = req.body.userId;
//   SingleItem.find({ users: { $all: [userId] } }, (err, data) => {
//     if (err) {
//       res.send({
//         msg: 'user or items not found',
//         success: false,
//       });
//     }
//     res.send({
//       success: true,
//       msg: 'All user Items found',
//       data: data,
//     });
//   });
// };

// // ?
// exports.get_all_followed_items = (req, res) => {
//   SingleItem.find({}, (err, items) => {
//     let followedItems = [];
//     items.forEach((e) => {
//       if (e.following === true) {
//         followedItems.push(e);
//       }
//     });
//     if (err) {
//       res.send({
//         msg: 'No followed items',
//         success: false,
//         error: err,
//       });
//     }
//     res.send({
//       msg: 'Followed Items',
//       success: true,
//       data: followedItems,
//     });
//   });
// };

// // Inital scrape
// exports.first_scrape = (req, res) => {
//   console.log(req.body);
//   let userId = req.body.userId;
//   let url = req.body.url;
//   let follow = req.body.follow;
//   let target = req.body.targetPrice;
//   if (follow === null) {
//     follow = false;
//   }
//   scraper(url)
//     .then((result) => {
//       if (result) {
//         let newItem = new SingleItem({
//           name: result.title,
//           link: url,
//           imgUrl: result.imgUrl,
//           price: result.priceInt,
//           following: follow,
//           targetPrice: target,
//           users: userId,
//         });
//         newItem.save((err, result) => {
//           if (err) {
//             res.send({
//               success: false,
//               msg: 'Failed to save in database',
//               error: err,
//             });
//           }
//           let itemCollection = new Items({
//             uid: result._id,
//           });
//           itemCollection.save();
//           res.status(201).json({
//             message: 'Item found and saved in database',
//             success: true,
//             obj: result,
//           });
//         });
//       }
//     })
//     .catch((err) => {
//       res.send({
//         err: err,
//         msg: 'Error - something went wrong scraping the item',
//       });
//     });
// };

// // updates an item price
// exports.update_item = (req, res) => {
//   let id = req.body.id;
//   let targetPrice = req.body.targetPrice;
//   let updatePrice = cron_update_item(id, targetPrice);
//   if (updatePrice) {
//     res.send({
//       success: true,
//       message: 'Item updated successfully',
//     });
//   }
// };

// // changes if an item needs to be tracked
// exports.change_tracking = (req, res) => {
//   let id = req.body.id;
//   let follow = req.body.follow;
//   SingleItem.findOne({ _id: id }, (err, item) => {
//     item.following = follow;
//     item.save((err, updatedItem) => {
//       if (err) {
//         res.send({
//           error: err,
//           message: "Couldn't update following status",
//           success: false,
//         });
//       }
//       res.send({
//         message: 'Item updated',
//         success: true,
//         obj: updatedItem,
//       });
//     });
//   });
// };

// // removes an item - from where?
// exports.delete_item = (req, res) => {
//   let userId = req.body.userId;
//   let itemId = req.body.itemId;
//   // TODO: finish delete item for user array
//   console.log(userId, itemId);
//   User.updateOne(
//     { _id: userId },
//     { $pull: { user_items: itemId } },
//     (err, done) => {
//       if (err) {
//         console.log(err);
//       }
//     }
//   );
//   SingleItem.findById(itemId, (err, document) => {
//     if (err) {
//       res.send({
//         error: err,
//         message: "Couldn't find the requested item",
//         success: false,
//         code: 400,
//       });
//     }
//     newItem.save((err, item) => {
//       if (err) {
//         res.send({
//           error: err,
//           message: "Couldn't find the requested item",
//           success: false,
//           code: 400,
//         });
//       }
//     });
//   });
//   SingleItem.findByIdAndRemove(itemId, (err, success) => {
//     if (err) {
//       res.send({
//         error: err,
//         message: "Couldn't find the requested item",
//         success: false,
//         code: 400,
//       });
//     }
//     console.log('Item removed from items db');
//   });
//   res.send({
//     message: 'Item deleted from database',
//     success: true,
//   });
// };

// // cron job
// cron.schedule('0 */6 * * *', () => {
//   SingleItem.find({}, (err, items) => {
//     let followedItems = [];
//     items.forEach((e) => {
//       if (e.following === true) {
//         followedItems.push(e);
//       }
//     });
//     if (err) {
//       console.log({
//         error: err,
//         msg: 'Failed to update item',
//       });
//     }
//     followedItems.forEach((e) => {
//       console.log('Updating');
//       cron_update_item(e._id, e.targetPrice);
//     });
//   });
// });

// // update price job from the cron
// let cron_update_item = async (id, targetPrice) => {
//   let itemId = id;
//   await SingleItem.findById(itemId, (err, item) => {
//     scraper(item.link)
//       .then((data) => {
//         if (data) {
//           let newObj = {
//             tite: data.title,
//             price: data.priceInt,
//             date: Date.now().toString(),
//           };
//           SingleItem.findOneAndUpdate(
//             { _id: itemId },
//             { $push: { pastPrices: newObj } },
//             (err, result) => {
//               if (err) {
//                 return {
//                   success: false,
//                   error: err,
//                 };
//               }
//               if (newObj.price < targetPrice) {
//                 sendEmail(itemId);
//               }
//               let log = {
//                 msg: `Cron Job Run`,
//                 time: new Date(),
//               };
//               console.log('Scraping item');
//               fs.writeFileSync('./logs/cron.json', JSON.stringify(log), {
//                 encoding: 'utf8',
//                 flag: 'a',
//               });
//               return;
//             }
//           );
//         }
//       })
//       .catch((err) => {
//         return {
//           success: false,
//           message: 'Major error',
//           error: err,
//         };
//       });
//   });
// };

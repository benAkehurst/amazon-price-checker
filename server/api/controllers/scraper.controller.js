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

/**
 * Method to do an initial scrape of item data and save to user
 * POST
 * Params - /:token/:uniqueId
 * Body - {
 *  "itemUrl": "amazon.co.uk url",
    "followItem": boolean,
    "targetPrice": number
 * }
 */
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

/**
 * Method to get all the items from a users tracked items
 * GET
 * Params - /:token/:uniqueId
 */
exports.fetchAllTrackedItems = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Please provide all data required.',
    data: null,
  });
};

/**
 * Method that when called will go out and run a job to rescan for updated prices
 * GET
 * Params - /:token/:uniqueId
 */
exports.updateAllUserPrices = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Please provide all data required.',
    data: null,
  });
};

/**
 * Method that when called will go out and run a job to rescan for updated price on single item
 * GET
 * Params - /:token/:uniqueId
 */
exports.updatePricesManually = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Please provide all data required.',
    data: null,
  });
};

/**
 * Method that change the tracking of an item
 * PUT
 * Params - /:token/:uniqueId/:itemUniqueId
 */
exports.changeItemTracking = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Please provide all data required.',
    data: null,
  });
};

/**
 * Method that when called will remove an item from the tracking on a user
 * GET
 * Params - /:token/:uniqueId/:itemUniqueId
 */
exports.deleteItemFromTracking = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Please provide all data required.',
    data: null,
  });
};

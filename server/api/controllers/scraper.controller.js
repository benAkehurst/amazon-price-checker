'use strict';
const User = require('../models/user.model');
const SingleItem = require('../models/singleItem.model');
const {
  fetchInitialItemInfo,
  fetchCurrentItemPrice,
} = require('../../middlewares/services/scraperService');
const {
  validateAmazonUrl,
  checkToken,
} = require('../../middlewares/validators');
const {
  AddNewItemIdToUser,
  UpdateSingleItemCurrentPrice,
  UpdateSingleItemPastPrices,
} = require('../data/scraper.data');
const {
  FetchAllTrackedItems,
  ChangeItemTracking,
} = require('../data/items.data');

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
      const newSingleItem = new SingleItem({
        name: scrapedItem.title,
        link: itemUrl,
        imgUrl: scrapedItem.imgUrl,
        currentPrice: scrapedItem.priceConverted,
        targetPrice: targetPrice,
        following: followItem,
        pastPrices: [],
      });
      if (!scrapedItem) {
        res.status(500).json({
          success: false,
          message: 'Scrape of item failed',
          data: null,
        });
      } else if (!tokenValid.success) {
        res.status(501).json({
          success: false,
          message: 'Token not valid.',
          data: null,
        });
      } else {
        const newSingleItemSaved = await newSingleItem.save();
        const user = await AddNewItemIdToUser(uniqueId, newSingleItemSaved._id);
        res.status(201).json({
          success: true,
          message: 'Item tracked and saved successfully.',
          data: user.trackedItems,
        });
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
  const { token, uniqueId } = req.params;
  if (!uniqueId || !token) {
    res.status(400).json({
      success: false,
      message: 'Please provide all data required.',
      data: null,
    });
  } else {
    try {
      const tokenValid = await checkToken(token);
      const user = await User.findOne({ uniqueId: uniqueId });
      if (!tokenValid) {
        res.status(501).json({
          success: false,
          message: 'Token not valid.',
          data: null,
        });
      } else if (!user) {
        res.status(501).json({
          success: false,
          message: 'User not found.',
          data: null,
        });
      } else {
        let itemsIds = user.trackedItems;
        let allItems = await FetchAllTrackedItems(itemsIds);
        res.status(200).json({
          success: true,
          message: 'Got user items',
          data: allItems,
        });
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
 * Method that when called will go out and run a job to rescan for updated price on single item
 * POST
 * Params - /:token/:uniqueId/:singleItemId/:singleItemLink
 * Body - singleItemId, singleItemLink
 */
exports.updateSingleItemPrice = async (req, res) => {
  const { token, uniqueId } = req.params;
  const { singleItemId, singleItemLink } = req.body;
  if (!uniqueId || !token || !singleItemId || !singleItemLink) {
    res.status(400).json({
      success: false,
      message: 'Please provide all data required.',
      data: null,
    });
  } else {
    try {
      const tokenValid = await checkToken(token);
      if (!tokenValid.success) {
        res.status(501).json({
          success: false,
          message: 'Token not valid.',
          data: null,
        });
      } else {
        await UpdateSingleItemPastPrices(singleItemId);
        const currentItemPrice = await fetchCurrentItemPrice(singleItemLink);
        const currentItemPriceDBWrite = await UpdateSingleItemCurrentPrice(
          singleItemId,
          currentItemPrice
        );
        res.status(200).json({
          success: true,
          message: 'Item price updated successfully.',
          data: { currentItemPriceDBWrite },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong fetching initial item details.',
        data: error,
      });
    }
  }
};

/**
 * Method that change the tracking of an item
 * PUT
 * Params - /:token/:uniqueId/:itemUniqueId
 */
exports.changeItemTracking = async (req, res) => {
  const { token, uniqueId, itemUniqueId, trackStatus } = req.params;
  if (!uniqueId || !token || !itemUniqueId || !trackStatus) {
    res.status(400).json({
      success: false,
      message: 'Please provide all data required.',
      data: null,
    });
  } else {
    try {
      const tokenValid = await checkToken(token);
      if (!tokenValid.success) {
        res.status(501).json({
          success: false,
          message: 'Token not valid.',
          data: null,
        });
      } else {
        const updated = await ChangeItemTracking(itemUniqueId, trackStatus);
        res.status(200).json({
          success: true,
          message: 'Item tracking updated successfully.',
          data: updated.following,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong fetching initial item details.',
        data: error,
      });
    }
  }
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

/**
 * Method used internally when cron job is called
 * @param {*} singleItemId
 * @param {*} singleItemLink
 * @returns
 */
exports.updateSingleItemPriceInternal = async (
  singleItemId,
  singleItemLink
) => {
  if (!singleItemId || !singleItemLink) {
    return;
  } else {
    try {
      await UpdateSingleItemPastPrices(singleItemId);
      await fetchCurrentItemPrice(singleItemLink);
      await UpdateSingleItemCurrentPrice(singleItemId, currentItemPrice);
      return;
    } catch {
      return;
    }
  }
};

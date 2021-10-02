const jwt = require('jsonwebtoken');
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
} = require('../DB/scraper.db');
const {
  FetchAllTrackedItems,
  ChangeItemTracking,
  DeleteItemTracking,
} = require('../DB/items.db');
const { sendEmail } = require('../../middlewares/services/emailService');

/**
 * Method to do an initial scrape of item data and save to user
 * POST
 * Params - /:token/:userUID
 * Body - {
 *  "itemUrl": "amazon.co.uk url",
    "followItem": boolean,
    "targetPrice": number
 * }
 */
exports.createInitialItem = async (req, res) => {
  const { token, userUID } = req.params;
  const { itemUrl, followItem, targetPrice } = req.body;

  if (!userUID || !token || !itemUrl || !followItem || !targetPrice) {
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
      } else if (!jwt.verify(token, process.env.JWT_SECRET)) {
        res.status(501).json({
          success: false,
          message: 'Token not valid.',
          data: null,
        });
      } else {
        const newSingleItemSaved = await newSingleItem.save();
        const user = await AddNewItemIdToUser(userUID, newSingleItemSaved._id);
        const trackedItems = await FetchAllTrackedItems(user.trackedItems);
        res.status(201).json({
          success: true,
          message: 'Item tracked and saved successfully.',
          data: trackedItems,
        });
        if (targetPrice <= scrapedItem.priceConverted) {
          const data = {
            from: `<Site Name & Email Address><${process.env.EMAIL_USERNAME}>`,
            to: user.email,
            subject: `Your Price for ${newSingleItem.name} matches your target price`,
            html: `<p>Please use the link to purchase ${newSingleItem.name}: <strong><a href="${itemUrl}" target="_blank">Click here to buy!</a></strong></p>`,
          };
          sendEmail(data);
        }
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
 * Params - /:token/:userUID
 */
exports.fetchAllTrackedItems = async (req, res) => {
  const { token, userUID } = req.params;
  if (!userUID || !token) {
    res.status(400).json({
      success: false,
      message: 'Please provide all data required.',
      data: null,
    });
  } else {
    try {
      const tokenValid = await checkToken(token);
      const user = await User.findOne({ userUID: userUID });
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
 * Params - /:token/:userUID/:singleItemId/:singleItemLink
 * Body - singleItemId, singleItemLink
 */
exports.updateSingleItemPrice = async (req, res) => {
  const { token, userUID } = req.params;
  const { singleItemId, singleItemLink } = req.body;
  if (!userUID || !token || !singleItemId || !singleItemLink) {
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
 * Params - /:token/:userUID/:itemUniqueId
 */
exports.changeItemTracking = async (req, res) => {
  const { token, userUID, itemUniqueId, trackStatus } = req.params;
  if (!userUID || !token || !itemUniqueId || !trackStatus) {
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
        const updated = await ChangeItemTracking(itemuserUID, trackStatus);
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
 * Params - /:token/:userUID/:itemUniqueId
 */
exports.deleteSingleItem = async (req, res) => {
  const { token, userUID, itemUniqueId } = req.params;
  if (!userUID || !token || !itemUniqueId) {
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
        const deleted = await DeleteItemTracking(userUID, itemuserUID);
        res.status(200).json({
          success: true,
          message: 'Item deleted successfully.',
          data: deleted,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong deleting item details.',
        data: error,
      });
    }
  }
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

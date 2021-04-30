const SingleItem = require('../models/singleItem.model');

const UpdateSingleItemPastPrices = async (singleItemId) => {
  const item = await SingleItem.findOne({ _id: singleItemId });
  const pastPriceObj = {
    time: Date.now(),
    pastPrice: item.currentPrice,
  };
  const singleItem = await SingleItem.findOneAndUpdate(
    { _id: singleItemId },
    {
      $push: { pastPrices: pastPriceObj },
    },
    { new: true }
  );
  return singleItem;
};

const UpdateSingleItemCurrentPrice = async (singleItemId, newCurrentPrice) => {
  const singleItem = await SingleItem.findOneAndUpdate(
    { _id: singleItemId },
    {
      $set: { currentPrice: newCurrentPrice.priceConverted },
    },
    { new: true }
  );
  return singleItem;
};

module.exports = {
  UpdateSingleItemCurrentPrice,
  UpdateSingleItemPastPrices,
};

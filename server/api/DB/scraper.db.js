const User = require("../models/user.model");
const SingleItem = require("../models/singleItem.model");

const AddNewItemIdToUser = async (userUID, singleItemId) => {
  const user = await User.findOneAndUpdate(
    { userUID: userUID },
    {
      $push: {
        trackedItems: singleItemId,
      },
    },
    { new: true }
  );
  return user;
};

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
  AddNewItemIdToUser,
  UpdateSingleItemCurrentPrice,
  UpdateSingleItemPastPrices,
};

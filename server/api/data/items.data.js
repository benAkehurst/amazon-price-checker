const SingleItem = require('../models/singleItem.model');

const FetchAllTrackedItems = async (trackedItemsIds) => {
  const allItems = await SingleItem.find({
    _id: {
      $in: trackedItemsIds,
    },
  });
  return allItems;
};

const ChangeItemTracking = async (itemId, trackStatus) => {
  const changedTracking = await SingleItem.findOneAndUpdate(
    { _id: itemId },
    {
      $set: {
        following: trackStatus,
      },
    },
    { new: true }
  );
  return changedTracking;
};

module.exports = {
  FetchAllTrackedItems,
  ChangeItemTracking,
};

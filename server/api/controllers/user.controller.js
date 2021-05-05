const mongoose = require('mongoose');
const _ = require('lodash');
const User = mongoose.model('User');

/**
 * Gets single user info
 * GET
 * PARAMS - /:userUID
 */
exports.fetch_user_information = async (req, res) => {
  const { userUID } = req.params;
  if (!userUID) {
    res.status(400).json({
      success: false,
      message: 'Please provide unique ID!',
      data: null,
    });
  } else {
    try {
      const user = await User.findOne({ userUID: userUID });
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'User does not exist.',
          data: err,
        });
      } else {
        let userFiltered = _.pick(user.toObject(), ['firstName']);
        res.status(200).json({
          success: true,
          message: 'User data fetched successfully',
          data: userFiltered,
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        message: 'Something went wrong.',
        data: null,
      });
    }
  }
};

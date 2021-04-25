'use strict';
module.exports = (app) => {
  const userController = require('../controllers/user.controller');
  app
    .route('/api/v1/user/fetch-user-info/:uniqueId')
    .get(userController.fetch_user_information);
};

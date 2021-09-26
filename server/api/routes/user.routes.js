'use strict';
module.exports = (app) => {
  const userController = require('../controllers/user.controller');
  app
    .route('/api/v2/user/fetch-user-info/:userUID')
    .get(userController.fetch_user_information);
};

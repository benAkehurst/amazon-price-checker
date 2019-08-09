'use strict';
module.exports = (app) => {
  const userController = require('../controllers/userController');

  /**
   * User Routes
   */
  app.route('/api/users')
  .get(userController.get_all_users);

  app.route('/api/user/create')
  .post(userController.create_a_user);

  app.route('/api/user/login')
  .post(userController.login_a_user);

  /**
   * Individual User Routes
   */
  app.route('/api/user/:userId')
    .get(userController.get_single_user)
    .put(userController.update_a_user)
    .put(userController.delete_a_user)
    .delete(userController.delete_a_user);
  };

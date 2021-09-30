'use strict';
module.exports = (app) => {
  const authController = require('../controllers/auth.controller');
  app.route('/api/v2/auth/login-user').post(authController.login_user);
  app
    .route('/api/v2/auth/create-new-user')
    .post(authController.create_new_user);
  app
    .route('/api/v2/auth/verification/verify-account/:userUID/:secretCode')
    .get(authController.validate_user_email_and_account);
  app
    .route('/api/v2/auth/password-reset/get-code')
    .post(authController.get_reset_password_code);
  app
    .route('/api/v2/auth/password-reset/verify-code')
    .post(authController.verify_new_user_password);
  app
    .route('/api/v2/auth/delete-account')
    .delete(authController.delete_user_account);
  app
    .route('/api/v2/auth/check-token-valid-external/:token')
    .get(authController.check_token_valid_external);
  app.route('/api/v2/auth/google').post(authController.googleLogin);
};

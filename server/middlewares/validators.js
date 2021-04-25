const jwt = require('jsonwebtoken');
const User = require('../api/models/user.model');

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
  if (password.length <= 6 || password === '') {
    return false;
  }
  return true;
};

const checkEmailExists = (email) => {
  const submittedEmail = email;
  return User.find({ email: submittedEmail }).then((result) => {
    if (result && result.length > 0) {
      return false;
    } else {
      return true;
    }
  });
};

const checkUserExists = async (uuid) => {
  return User.findOne({ uniqueId: uuid }, (err, success) => {
    if (err) {
      return false;
    } else if (success) {
      return true;
    }
  });
};

module.exports = {
  validateEmail,
  validatePassword,
  checkEmailExists,
  checkUserExists,
};

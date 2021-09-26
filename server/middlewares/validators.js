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
  return User.findOne({ userUID: uuid }, (err, success) => {
    if (err) {
      return false;
    } else if (success) {
      return true;
    }
  });
};

/**
 * validateAmazonUrl checks if the supplied url contains amazon.co.uk
 * @param {string} url
 * @returns {Boolean} True or False
 */
const validateAmazonUrl = (url) => {
  const re = /^https:\/\/www\.amazon\.co.uk\//;
  return re.test(String(url).toLowerCase());
};

const checkToken = (req) => {
  let token = req;
  return new Promise((resolve, reject) => {
    if (!token) {
      reject({ success: false, message: 'No token' });
    } else if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject({
            success: false,
            message: 'Token is not valid',
          });
        } else {
          resolve({
            success: true,
            message: 'Token is valid',
          });
        }
      });
    } else {
      reject({
        success: false,
        message: 'No Token supplied',
      });
    }
  });
};

module.exports = {
  validateEmail,
  validatePassword,
  checkEmailExists,
  checkUserExists,
  validateAmazonUrl,
  checkToken,
};

'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

let config = require('../../middlewares/config');
let middleware = require('../../middlewares/middleware');

/**
 * This function gets all the users in the Database
 */
exports.get_all_users = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.send({
        error: err,
        message: 'No users fround',
        code: 204
      });
    }
    res.send({
      message: 'All users returned',
      data: users,
      code: 200
    });
  });
};

/**
 * Creates a new user in the DB
 */
exports.create_a_user = (req, res) => {
  let newUser = new User({
    name: undefined,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  });
  newUser.save((err, user) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't create new user",
        code: 400
      });
    }
    let userFiltered = _.pick(user.toObject(), [
      'name',
      'email',
      'created_date',
      '_id',
      'status'
    ]);
    res.status(201).json({
      message: 'User created',
      success: true,
      obj: userFiltered
    });
  });
};

/**
 * Function to login a user
 */
exports.login_a_user = (req, res) => {
  let data = req.body;
  User.findOne(
    {
      email: data.email
    },
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          title: 'An error occurred',
          error: err
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          title: 'Login failed',
          error: {
            message: 'Invalid login credentials'
          }
        });
      }
      if (!bcrypt.compareSync(data.password, user.password)) {
        return res.status(401).json({
          success: false,
          title: 'Login failed',
          error: {
            message: 'Invalid login credentials'
          }
        });
      }
      let token = jwt.sign({ username: user._id }, config.secret, {
        expiresIn: '24h' // expires in 24 hours
      });
      let userFiltered = _.pick(user.toObject(), [
        'name',
        'email',
        'created_date',
        '_id',
        'status'
      ]);
      res.status(200).json({
        message: 'Successfully logged in',
        success: true,
        obj: userFiltered,
        token: token
      });
    }
  );
};

/**
 * Gets a single user using the user ID sent as a url parameter
 */
exports.get_single_user = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      res.send({
        error: err,
        message: "Couldn't find user",
        code: 400
      });
    }
    res.send({
      message: 'User found',
      data: user,
      code: 200
    });
  });
};

/**
 * Updates a user. Finds them via the user ID in the url parameter
 */
exports.update_a_user = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.params.userId
    },
    req.body,
    {
      new: true
    },
    (err, user) => {
      if (err) {
        res.send({
          error: err,
          message: "Couldn't update user",
          code: 400
        });
      }
      res.send({
        message: 'User updated successfully',
        data: user,
        code: 200
      });
    }
  );
};

/**
 * Deletes the user from the db
 * TODO: Change method to status 'deleted in db'
 * TODO: Then if they really want to delete have admin do it?
 */
exports.delete_a_user = (req, res) => {
  User.remove(
    {
      _id: req.params.userId
    },
    (err, user) => {
      if (err) {
        res.send({
          error: err,
          message: "Couldn't delete user",
          code: 400
        });
      }
      res.send({
        message: 'User deleted successfully',
        data: user,
        code: 200
      });
    }
  );
};

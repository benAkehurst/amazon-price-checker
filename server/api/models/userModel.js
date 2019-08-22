'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    unique: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  user_items: {
    type: Array
  }
});

module.exports = mongoose.model('User', UserSchema);

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SingleItemSchema = new Schema({
  name: {
    type: String
  },
  link: {
    type: String
  },
  imgUrl: {
    type: String
  },
  price: {
    type: Number
  },
  targetPrice: {
    type: Number
  },
  following: {
    type: Boolean
  },
  pastPrices: {
    type: Array
  },
  users: {
    type: Array
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SingleItem', SingleItemSchema);

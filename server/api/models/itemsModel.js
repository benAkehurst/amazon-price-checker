'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
  uid: {type: mongoose.Schema.Types.ObjectId, ref: 'singleItem'},
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Items', ItemsSchema);

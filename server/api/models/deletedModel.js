'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeletedSchema = new Schema({
  item: { type: Object, ref: 'singleItem' },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Deleted', DeletedSchema);

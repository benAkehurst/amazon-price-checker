'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessSchema = new Schema({
  accessCode: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    expires: 604800, // set to valid for 1 week
  },
});

module.exports = mongoose.model('Access', AccessSchema);

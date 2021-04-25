'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
    acceptedTerms: {
      type: Boolean,
    },
    createdOnDate: {
      type: String,
    },
    uniqueId: {
      type: String,
      required: false,
    },
    userAcquisitionLocation: {
      type: String,
    },
    userItems: {
      type: Array,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

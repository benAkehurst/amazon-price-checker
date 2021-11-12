"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SingleItemSchema = new Schema({
  name: {
    type: String,
  },
  link: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  currentPrice: {
    type: Number,
  },
  targetPrice: {
    type: Number,
  },
  asin: {
    type: String,
  },
  rating: {
    type: String,
  },
  following: {
    type: Boolean,
  },
  pastPrices: {
    type: Array,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SingleItem", SingleItemSchema);

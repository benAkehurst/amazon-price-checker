'use strict';
const mongoose = require('mongoose');

exports.scrapePage = (req, res) => {
  console.log(req.body);
  res.send({msg:'in scrape page function'});
};

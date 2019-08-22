'use strict';
module.exports = app => {
  const scraperController = require('../controllers/scraperController');

  /**
   * Scraper Routes - Item Collection
   */
  app.route('/api/get-all-product-data').get(scraperController.get_all_items);
  app.route('/api/get-all-followed-items').get(scraperController.get_all_followed_items);
  app.route('/api/get-single-user-items').post(scraperController.get_single_user_items);
  app.route('/api/fetch-single-item').post(scraperController.get_single_item);
  app.route('/api/initial-add-product').post(scraperController.first_scrape);
  app.route('/api/update-scraped-item').post(scraperController.update_item);
  app.route('/api/update-scraped-following').post(scraperController.change_tracking);
  app.route('/api/remove-scraped-item').post(scraperController.delete_item);
};

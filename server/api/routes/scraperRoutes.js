'use strict';
module.exports = app => {
  const scraperController = require('../controllers/scraperController');

  /**
   * Scraper Routes - Item Collection
   */
  app.route('/api/get-all-product-data').get(scraperController.get_all_items);
  app.route('/api/scrape-single-item').post(scraperController.get_single_item);
  app.route('/api/initial-add-product').post(scraperController.first_scrape);
  app.route('/api/updateScrapeItem').post(scraperController.update_item);
  app.route('/api/removeScrapeItem/:itemId').delete(scraperController.delete_item);
};

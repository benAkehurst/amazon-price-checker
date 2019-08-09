'use strict';
module.exports = app => {
  const scraperController = require('../controllers/scraperController');

  /**
   * Scraper Routes - Item Collection
   */
  app.route('/api/scrapeData').get(scraperController.get_all_items);
  app.route('/api/scrapeData/:itemId').get(scraperController.get_single_item);
  app.route('/api/initalScrapeOfItem').post(scraperController.first_scrape);
  app.route('/api/updateScrapeItem').post(scraperController.update_item);
  app.route('/api/removeScrapeItem/:itemId').delete(scraperController.delete_item);
};

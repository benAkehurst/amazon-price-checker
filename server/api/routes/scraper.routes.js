'use strict';
module.exports = (app) => {
  const scraperController = require('../controllers/scraper.controller');

  app
    .route('/api/v2/scraper/create-initial-item/:token/:uniqueId')
    .post(scraperController.createInitialItem);
  app
    .route('/api/v2/scraper/fetch-all-tracked-items/:token/:uniqueId')
    .get(scraperController.fetchAllTrackedItems);
  app
    .route('/api/v2/scraper/update-single-item-price/:token/:uniqueId')
    .post(scraperController.updateSingleItemPrice);
  app
    .route(
      '/api/v2/scraper/change-item-tracking/:token/:uniqueId/:itemUniqueId/:trackStatus'
    )
    .get(scraperController.changeItemTracking);
  app
    .route('/api/v2/scraper/delete-single-item/:token/:uniqueId/:itemUniqueId')
    .delete(scraperController.deleteSingleItem);
};

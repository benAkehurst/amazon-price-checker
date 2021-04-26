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
    .route('/api/v2/scraper/update-all-user-prices/:token/:uniqueId')
    .get(scraperController.updateAllUserPrices);
  app
    .route('/api/v2/scraper/update-prices-manually/:token/:uniqueId')
    .get(scraperController.updatePricesManually);
  app
    .route(
      '/api/v2/scraper/change-item-tracking/:token/:uniqueId/:itemUniqueId'
    )
    .post(scraperController.changeItemTracking);
  app
    .route(
      '/api/v2/scraper/delete-item-from-tracking/:token/:uniqueId/:itemUniqueId'
    )
    .post(scraperController.deleteItemFromTracking);
};

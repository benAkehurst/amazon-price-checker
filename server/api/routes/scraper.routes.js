"use strict";
module.exports = (app) => {
  const scraperController = require("../controllers/scraper.controller");

  app
    .route("/api/v2/scraper/create-initial-item/:token/:userUID")
    .post(scraperController.createInitialItem);
  app
    .route("/api/v2/scraper/fetch-all-tracked-items/:token/:userUID")
    .get(scraperController.fetchAllTrackedItems);
  app
    .route(
      "/api/v2/scraper/update-single-item-price/:token/:userUID/:singleItemId"
    )
    .get(scraperController.updateSingleItemPrice);
  app
    .route(
      "/api/v2/scraper/change-item-tracking/:token/:userUID/:itemUniqueId/:trackStatus"
    )
    .get(scraperController.changeItemTracking);
  app
    .route("/api/v2/scraper/delete-single-item/:token/:userUID/:itemUniqueId")
    .delete(scraperController.deleteSingleItem);
};

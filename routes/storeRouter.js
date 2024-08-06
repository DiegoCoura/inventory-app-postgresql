const { Router } = require("express");
const storeController = require("../controllers/storeController");

const storeRouter = Router();

storeRouter.get("/", storeController.index);

storeRouter.get("/category/:id", storeController.byCategory);

module.exports = storeRouter;

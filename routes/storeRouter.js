const { Router } = require("express");
const storeController = require("../controllers/storeController");

const storeRouter = Router();

storeRouter.get("/", storeController.index);

storeRouter.get("/product/new", storeController.add_product_get);

storeRouter.post("/product/new", storeController.add_product_post);

storeRouter.get("/product/edit/:id", storeController.product_update_get);

storeRouter.post("/product/edit/:id", storeController.product_update_post);

storeRouter.post("/product/delete/:id", storeController.delete_product);

storeRouter.get("/category/:id", storeController.byCategory);

storeRouter.get("/product/:id", storeController.product_detail);

module.exports = storeRouter;

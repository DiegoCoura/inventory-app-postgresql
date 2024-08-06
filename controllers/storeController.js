const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.index = asyncHandler(async (req, res, next) => {
  const allCategories = await db.getAllCategories();
  const allProducts = await db.getAllProducts();

  res.render("index", {
    categories: allCategories,
    products: allProducts,
  });
});

exports.byCategory = asyncHandler(async (req, res, next) => {
  const allCategories = await db.getAllCategories();
  const categoryProducts = await db.getCategoryById(req.params.id);

  res.render("index", {
    categories: allCategories,
    products: categoryProducts,
  });
});

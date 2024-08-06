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

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await db.getProductById(req.params.id);
  
  if (!product.length) {
    const err = new Error("Product Not Found!");
    err.status = 404;    
    return next(err);
  } else {
    res.render("productDetails", {
      product: product[0],
    });
  }
});

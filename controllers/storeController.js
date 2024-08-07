const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [allCategories, allProducts] = await Promise.all([
    db.getAllCategories(),
    db.getAllProducts(),
  ]);

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

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    db.getProductById(req.params.id),
    db.getAllCategories(),
  ]);
  allCategories.forEach((category) => {
    if (category.category_name === product[0].category_name) {
      category.checked = "true";
    }
  });
  res.render("productForm", {
    product: product[0],
    categories: allCategories,
  });
});

exports.product_update_post = [
  body("product_name", "Product name must not be empty")
    .trim()
    .isLength({ min: 5, max: 255 })
    .escape(),
  body("image", "Image url must not be empty.")
    .trim()
    .isLength({ min: 5, max: 255 })
    .isURL()
    .withMessage("Invalid URL"),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 10, max: 255 })
    .withMessage("Description must be minimum 10 characters and maximum 255"),
  body("category_id", "Invalid category ").escape(),
  body("price", "Price must not be empty.")
    .notEmpty()
    .isNumeric()
    .isFloat({ min: 1 }),
  body("quantity", "Quantity must not be empty.")
    .isNumeric()
    .withMessage("Must be a number")
    .isInt({ min: 1 })
    .withMessage("must be an integer bigger than 0"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newInfos = {
      product_id: +req.params.id,
      product_name: req.body.product_name,
      description: req.body.description.substr(0, 255),
      price: parseFloat(req.body.price),
      category_id: +req.body.category_id,
      image: req.body.image,
      quantity: +req.body.quantity,
    };

    if (!errors.isEmpty()) {
      const allCategories = await db.getAllCategories();

      for (const category of allCategories) {
        if (category.category_id === newInfos.category_id) {
          category.checked = "true";
          newInfos.category_name = category.category_name;
        }
      }
      res.render("productForm", {
        product: newInfos,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await db.updateProduct(newInfos);
      res.redirect(`/product/${newInfos.product_id}`);
    }
  }),
];

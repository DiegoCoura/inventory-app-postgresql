const pool = require("./pool");

exports.getAllProducts = async () => {
  const { rows } = await pool.query("SELECT * FROM products");
  return rows;
};

exports.getProductById = async (productId) => {
  const { rows } = await pool.query(
    "SELECT *, category_name FROM products INNER JOIN categories on products.category_id = categories.category_id WHERE product_id = ($1)",
    [productId]
  );
  return rows;
};

exports.addNewProduct = async (productInfos) => {
  const { rows } = await pool.query(
    "INSERT INTO products (product_name, description, category_id, price, image, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      productInfos.product_name,
      productInfos.description,
      productInfos.category_id,
      productInfos.price,
      productInfos.image,
      productInfos.quantity,
    ]
  );

  return rows;
};

exports.updateProduct = async (newInfos) => {
  await pool.query(
    "UPDATE products SET product_name = ($1), description = ($2), category_id = ($3), price = ($4), image = ($5), quantity = ($6)  WHERE product_id = ($7)",
    [
      newInfos.product_name,
      newInfos.description,
      newInfos.category_id,
      newInfos.price,
      newInfos.image,
      newInfos.quantity,
      newInfos.product_id,
    ]
  );
  return;
};

exports.deleteProduct = async (productId) => {
  const { rows } = await pool.query(
    "DELETE FROM products WHERE product_id = ($1) RETURNING product_id",
    [productId]
  );
  return rows;
};

exports.getAllCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");

  return rows;
};

exports.getCategoryById = async (categoryId) => {
  const { rows } = await pool.query(
    "SELECT * FROM products WHERE category_id = ($1)",
    [categoryId]
  );
  return rows;
};

exports.addCategory = async (categoryName) => {
  const { rows } = await pool.query(
    "INSERT INTO categories (category_name) VALUES ($1) RETURNING *",
    [categoryName]
  );

  return rows;
};

exports.deleteCategory = async (categoryId) => {
  const { rows } = await pool.query(
    "DELETE FROM categories WHERE category_id = ($1) RETURNING *",
    [categoryId]
  );
  return rows;
};

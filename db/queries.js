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

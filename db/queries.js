const pool = require("./pool");

exports.getAllProducts = async () => {
  const { rows } = await pool.query("SELECT * FROM products");
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

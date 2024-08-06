#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();
//const db = process.argv[2];
const db = process.env.LOCAL_DB_STRING;


// # populating local db
// node db/populatedb.js <local-db-url>

// # populating production db
// # run it from your machine once after deployment of your app & db
// node db/populatedb.js <production-db-url>

const allCategories = [];
const allProducts = [];

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR ( 255 ) NOT NULL 
);

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_name VARCHAR ( 255 ) NOT NULL, description VARCHAR ( 255 ) NOT NULL, price NUMERIC(5, 2) NOT NULL,
  category_id INT, FOREIGN KEY(category_id) REFERENCES categories(category_id),
  image VARCHAR (255) NOT NULL, quantity INTEGER NOT NULL 
);

`;

async function fetchProducts() {
  try {
    const fetchAllProducts = await fetch("https://fakestoreapi.com/products");
    const allProductsJson = await fetchAllProducts.json();

    allProductsJson.forEach((product) => {
      allProducts.push({
        name: product.title,
        description: product.description.substr(0, 255),
        price: product.price,
        category: product.category,
        image: product.image,
        quantity: product.rating.count,
      });
      if (!allCategories.includes(product.category)) {
        allCategories.push(product.category);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  console.log("seeding...");
  const categoryPromises = [];
  const productsPromises = [];
  const insertProductPromises = [];
  const client = new Client({
    connectionString: db,
  });
  await client.connect();
  //   await client.query(CREATE_TABLES);
  await fetchProducts();

  if (allProducts === null) {
    throw new Error("couldn't fetch data from fake store api");
  } else {
    try {
        allCategories.forEach((category) => {
          categoryPromises.push(
            client.query("INSERT INTO categories (category_name) VALUES ($1)", [
              category,
            ])
          );
        });
        await Promise.all(categoryPromises);
      const { rows } = await client.query("SELECT * FROM categories");

      allProducts.forEach((product) => {
        const productCategory = rows.find(
          (category) => category.category_name === product.category
        );
        if (productCategory) {
          product.category = productCategory.category_id;
        }
      });

      allProducts.forEach((product) => {
        insertProductPromises.push(
          client.query(
            "INSERT INTO products (product_name, description, price, category_id, image, quantity) VALUES ($1, $2, $3, $4, $5, $6)",
            [
              product.name,
              product.description,
              product.price,
              product.category,
              product.image,
              product.quantity,
            ]
          )
        );
      });
      await Promise.all(insertProductPromises);
      console.log("Populated")
    } catch (error) {
      console.log(error);
    }
  }

  await client.end();
  console.log("done");
}

main();

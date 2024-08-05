const asyncHandler = require("express-async-handler")
const db = require("../db/queries");

exports.index = asyncHandler(async(req,res,next)=>{
    const allCategories = await db.getAllCategories();
    const allProducts = await db.getAllProducts();
    
    res.render("index", {
        categories: allCategories,
        products: allProducts
    })
})
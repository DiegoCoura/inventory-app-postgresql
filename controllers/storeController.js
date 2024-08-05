const asyncHandler = require("express-async-handler")
const db = require("../db/queries");

exports.index = asyncHandler(async(req,res,next)=>{
    // const allProducts = await db.getAllProducts();
    res.render("index")
})
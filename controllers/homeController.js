const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const subcategorySchema = require("../models/subcategorySchema");
const categorySchema = require("../models/categorySchema");

exports.renderHome = (req, res) =>
  res.render("home", {
    title: "Adi Hardwares - Door Handles | Modular Kitchen | Hinges",
  });
exports.renderProducts = (req,res) => {
    categoryName = req.params.category;
    subcategoryName = req.params.subcategory;
    console.log("cat",categoryName);
    console.log("subcate", subcategoryName);
};
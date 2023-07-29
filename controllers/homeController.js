const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Subcategory = require("../models/subcategorySchema");
const Category = require("../models/categorySchema");

exports.renderHome = (req, res) =>
  res.render("home", {
    title: "Adi Hardwares - Door Handles | Modular Kitchen | Hinges",
  });
exports.renderProducts = (req,res) => {
    categoryName = req.params.category;
    // subcategoryName = req.params.subcategory;
    console.log("cat",categoryName);
    // console.log("subcate", subcategoryName);
};
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Subcategory = require("../models/subcategorySchema");
const Category = require("../models/categorySchema");
var _ = require("lodash");
exports.renderHome = catchAsyncErrors(async (req, res) => {
  try {
    const findCategories = await Category.find().populate({
      path: "subcategories",
      model: "Subcategory",
      populate: {
        path: "subSubcategories",
        model: "SubSubcategory",
      },
    });
    // Convert category names and subcategory names to title case
    const categories = findCategories.map((category) => ({
      name: _.startCase(category.name),
      subcategories: category.subcategories.map((subcategory) => ({
        name: _.startCase(subcategory.name),
        subSubcategories: subcategory.subSubcategories.map(
          (subSubcategory) => ({
            name: _.startCase(subSubcategory.name),
          })
        ),
      })),
    }));
    res.render("home", {
      title: "Adi Hardwares - Door Handles | Modular Kitchen | Hinges",
      categories: categories,
    });
  } catch (err) {
    return next(new ErrorHandler("Internal Server error", 500));
  }
});
exports.renderProducts = (req, res) => {
  categoryName = req.params.category;
  // subcategoryName = req.params.subcategory;
  console.log("cat", categoryName);
  // console.log("subcate", subcategoryName);
  res.render
};

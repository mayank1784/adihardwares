const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Subcategory = require("../models/subcategorySchema");
const Category = require("../models/categorySchema");
const SubSubcategory = require("../models/subSubcategorySchema");
const Image = require("../models/imageSchema");
var _ = require("lodash");

exports.renderHome = catchAsyncErrors(async (req, res,next) => {
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
    console.error("An error occurred:", err);
    // return next(new ErrorHandler("Internal Server error", 500));
  }
});
exports.renderProducts = catchAsyncErrors(async (req, res, next) => {
  categoryName = _.toLower(req.params.category);
  let categories;
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
    categories = findCategories.map((category) => ({
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
    // Find the category by name and populate its subcategories and their subsubcategories
    const foundCategory = await Category.findOne({ name: categoryName })
  .populate({
    path: "subcategories",
    model: Subcategory,
    populate: {
      path: "images",
      model: Image,
    },
  })
  .populate({
    path: "subcategories",
    model: Subcategory,
    populate: {
      path: "subSubcategories",
      model: SubSubcategory,
      populate: {
        path: "images",
        model: Image,
      },
    },
  })
  .populate("images")
  .exec();

    console.log("foundcategory: ", foundCategory);
    if (!foundCategory) {
      return res.render("notFound");
    }
    console.log("aaloo");
    // Convert category names, subcategory names, and subsubcategory names to title case
    // const formattedCategory = {
    //   ...foundCategory,
    //   subcategories: foundCategory.subcategories?.map((subcategory) => ({
    //     ...subcategory,
    //     images: subcategory.images?.map((image) => ({
    //       ...image,
    //     })),
    //   })),
    //   images: foundCategory.images?.map((image) => ({
    //     ...image,
    //   })),
    // };
    console.log("kanda");

    // Render the ejs template with the formatted category data
    console.log("foundcategoryname: ",foundCategory.name);
    // for (const sub of foundCategory.subcategories) {
    //   for (const subsub of sub.subSubcategories){
    //       console.log("sub sub images obj : ", subsub.images);
    //   }}
    
    res.render("product", {
      categories: categories, //for navbar
      formattedCategory: foundCategory, // for product showcase
      title: `ADI - ${ _.startCase(_.toLower(categoryName))}`, // site title
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

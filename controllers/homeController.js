const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Subcategory = require("../models/subcategorySchema");
const Category = require("../models/categorySchema");
const SubSubcategory = require("../models/subSubcategorySchema");
const Image = require("../models/imageSchema");
var _ = require("lodash");

let cachedCategories = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

async function getNavbarCategories() {
  const now = Date.now();
  if (cachedCategories && (now - lastCacheTime < CACHE_TTL)) {
    return cachedCategories;
  }

  const findCategories = await Category.find().populate({
    path: "subcategories",
    model: "Subcategory",
    populate: {
      path: "subSubcategories",
      model: "SubSubcategory",
    },
  });

  cachedCategories = findCategories.map((category) => ({
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
  
  lastCacheTime = now;
  return cachedCategories;
}

exports.renderHome = catchAsyncErrors(async (req, res,next) => {
  try {
    const categories = await getNavbarCategories();
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
  const categoryName = _.toLower(req.params.category);
  // const subcategory = _.toLower(req.params.subcategory);
  // console.log("subcategory in param", subcategory);
  let categories;
  try {
    const categories = await getNavbarCategories();
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

    // console.log("foundcategory: ", foundCategory);
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

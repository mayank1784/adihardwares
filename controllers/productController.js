const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Category = require("../models/categorySchema");
const Image = require("../models/imageSchema");
const Subcategory = require("../models/subcategorySchema");
const SubSubcategory = require("../models/subSubcategorySchema");
const ImgbbUploader = require("imgbb-uploader");
var _ = require("lodash");

function lowerCaseIfNotEmpty(str) {
  if (str.trim() === "") {
    return undefined;
  } else {
    return _.lowerCase(str.trim());
  }
}

exports.addProduct = catchAsyncErrors(async (req, res, next) => {
  const categoryName = lowerCaseIfNotEmpty(req.body.categoryName);
  const subcategoryName = lowerCaseIfNotEmpty(req.body.subcategoryName);
  const subsubcategoryName = lowerCaseIfNotEmpty(req.body.subsubcategoryName);
  const caption = lowerCaseIfNotEmpty(req.body.caption);

  const imageBuffers = req.files.map((file) => file.buffer);
  
  const directLinks = [];

  for (const imageBuffer of imageBuffers) {
    try {
      const options = {
        apiKey: process.env.IMGBB_API, // Replace with your ImgBB API key
        base64string: imageBuffer.toString("base64"),
        name: req.body.name, // Replace with the desired image name
      };
      const response = await ImgbbUploader(options);
      directLinks.push(response.display_url);
    } catch (error) {
      throw next(error);
    }
  }
  
  try {
    if (categoryName) {
      if (!subcategoryName) {
        // Case 1: Create category with its name and images
        const imageUrls = directLinks.map((url) => ({
          url,
          caption: categoryName, // Replace this with the common caption you want to use for all images
        }));
        const images = await Image.create({ imageUrl: imageUrls });

        const category = await Category.create({
          name: categoryName,
          images: images._id,
        });
      } else if (subcategoryName && !subsubcategoryName) {
        // Case 2: Create category, link created subcategory, and link created images with that subcategory
        const imageUrls = directLinks.map((url) => ({
          url,
          caption: subcategoryName, // Replace this with the common caption you want to use for all images
        }));
        const images = await Image.create({ imageUrl: imageUrls });
        const subcategory = await Subcategory.create({
          name: subcategoryName,
          images: images._id,
        });

        // Find the category based on the categoryName
        let category;
        category = await Category.findOne({ name: categoryName });
        if (category === null) {
          category = await Category.create({ name: categoryName });
        }
        // Add the subcategory ID to the category's subcategories array
        category.subcategories.push(subcategory._id);
        await category.save();
      } else if (subcategoryName && subsubcategoryName) {
        // Case 3: Create category, link created subcategory, link created subsubcategory, and link created images with that subsubcategory
        const imageUrls = directLinks.map((url) => ({
          url,
          caption: subsubcategoryName, // Replace this with the common caption you want to use for all images
        }));
        const images = await Image.create({ imageUrl: imageUrls });
        const subsubcategory = await SubSubcategory.create({
          name: subsubcategoryName,
          images: images._id,
        });
        let subcategory;
        subcategory = await Subcategory.findOne({
          name: subcategoryName,
        });
        if (subcategory === null) {
          subcategory = await Subcategory.create({ name: subcategoryName });
        }

        // Add the subsubcategory ID to the subcategory's subsubcategories array
        subcategory.subsubcategories.push(subsubcategory._id);
        await subcategory.save();
        let category;
        category = await Category.findOne({ name: categoryName });
        if (category === null) {
          category = await Category.create({ name: categoryName });
        }
        // Add the subcategory ID to the category's subcategories array
        category.subcategories.push(subcategory._id);
        await category.save();
      }
    } else {
      return next(new ErrorHandler("Category name is required", 500));
    }
    console.log("Data saved successfully");
    res.status(200).redirect("/api/v1/addProduct");
  } catch (err) {
    throw next(err);
  }
});

exports.renderForm = (req, res, next) => {
  res.render("form");
};

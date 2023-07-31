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
  if (str === undefined) {
    return undefined;
  } else if (str.trim() === "") {
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

  function returnCaption(para) {
    let givenCaption = caption;
    if (givenCaption === undefined) {
      givenCaption = para;
    }
    return givenCaption;
  }

  try {
    if (!categoryName) {
      throw new ErrorHandler("Category name is required", 500);
    }
    console.log(subcategoryName && subsubcategoryName);

    switch (true) {
      case subcategoryName !== undefined && subsubcategoryName !== undefined:
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
          category = await Category.create({
            name: categoryName,
            subcategories: [],
          });
        }
        let subcategory = await Subcategory.findOne({ name: subcategoryName });

        if (!subcategory) {
          subcategory = await Subcategory.create({
            name: subcategoryName,
            subSubcategories: [],
          });
          category.subcategories.push(subcategory._id);
          await category.save();
        }
        const imageUrls = directLinks.map((url) => ({
          url,
          caption: returnCaption(subsubcategoryName),
        }));
        const images = await Image.create({ imageUrl: imageUrls });
        const subsubcategory = await SubSubcategory.create({
          name: subsubcategoryName,
          images: images._id,
        });
        subcategory.subSubcategories.push(subsubcategory._id);
        // category.subcategories.push(subcategory._id);
        await subcategory.save();
        // await category.save();
        break;
      case subcategoryName !== undefined && subsubcategoryName == undefined:
        let category2 = await Category.findOne({ name: categoryName });
        if (!category2) {
          category2 = await Category.create({
            name: categoryName,
            subcategories: [],
          });
          // subcategory2 = await Subcategory.findOne({name: subcategoryName});
          // if (!subcategory2){

          // }
        }
        const imageUrls2 = directLinks.map((url) => ({
          url,
          caption: returnCaption(subcategoryName),
        }));
        const images2 = await Image.create({ imageUrl: imageUrls2 });
        const subcategory2 = await Subcategory.create({
          name: subcategoryName,
          images: images2._id,
        });
        category2.subcategories.push(subcategory2._id);
        await category2.save();
        break;
      default:
        const imageUrls3 = directLinks.map((url) => ({
          url,
          caption: returnCaption(categoryName),
        }));
        const images3 = await Image.create({ imageUrl: imageUrls3 });
        l;
        let category3 = await Category.create({
          name: categoryName,
          images: images3._id,
        });
        break;
    }
    console.log("Data saved successfully");
    res.status(200).redirect("/api/v1/addProduct");
  } catch (err) {
    throw next(err);
  }
});

exports.renderForm = async(req, res, next) => {
  try {
    const categoryData = await Category.distinct('name').exec();
    const subcategoryData = await Subcategory.distinct('name').exec();
    const subsubcategoryData = await SubSubcategory.distinct('name').exec();

    res.render("form", {
      categoryData,
      subcategoryData,
      subsubcategoryData,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Internal Server Error");
  }
};

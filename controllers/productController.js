const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Category = require("../models/categorySchema");
const Image = require("../models/imageSchema");
const Subcategory = require("../models/subcategorySchema");
const SubSubcategory = require("../models/subSubcategorySchema");
const ImgbbUploader = require("imgbb-uploader");


exports.addProduct = catchAsyncErrors(async (req, res, next) => {
    const { categoryName, subcategoryName, subsubcategoryName, caption} = req.body;
  console.log("req category: ", categoryName);
  console.log("subcate: ",subcategoryName);
  console.log("subsub: ",subsubcategoryName);
  console.log("capt: ",caption);
  const imageBuffers = req.files.map((file) => file.buffer);
  console.log("imgbuffer", imageBuffers);
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
      console.error("Error uploading image:", error);
      // Handle errors as needed
    }
  }

  console.log("List of direct links:", directLinks);

  
    // Convert imageUrls to an array of objects with optional captions
    // const images = imageUrls.split("\n").map((url) => {
    //   const [imageUrl, caption] = url.split("|");
    //   return { imageUrl: imageUrl.trim(), caption: caption ? caption.trim() : undefined };
    // });
    // console.log(images);
  
    try {
      // // Find or create the category
      // let category = await Category.findOne({ name: categoryName });
      // if (!category) {
      //   category = new Category({ name: categoryName });
      // }
  
      // // Find or create the subcategory under the category
      // let subcategory;
      // if (subcategoryName) {
      //   subcategory = category.subcategories.find((sub) => sub.name === subcategoryName);
      //   if (!subcategory) {
      //     subcategory = new Subcategory({ name: subcategoryName });
      //     category.subcategories.push(subcategory._id);
      //   }
      // }
  
      // // Find or create the subsubcategory under the subcategory
      // let subsubcategory;
      // if (subsubcategoryName) {
      //   if (subcategory) {
      //     subsubcategory = subcategory.subcategories.find((subsub) => subsub.name === subsubcategoryName);
      //   }
      //   if (!subsubcategory) {
      //     subsubcategory = new SubSubcategory({ name: subsubcategoryName });
      //     if (subcategory) {
      //       subcategory.subSubcategories.push(subsubcategory);
      //     } else {
      //       subcategory = new Subcategory({ name: subcategoryName, subSubcategories: [subsubcategory] });
      //       category.subcategories.push(subcategory);
      //     }
      //   }
      // }
  
      // // Determine the correct array to add images to
      // let imageArray;
      // if (subsubcategory) {
      //   imageArray = subsubcategory.images;
      // } else if (subcategory) {
      //   imageArray = subcategory.images;
      // } else {
      //   imageArray = category.images;
      // }
  
      // // Save images to the database and push image references to the array
      // await Promise.all(images.map(async (image) => {
      //   if (image.caption) {
      //     const newImage = new Image({ imageUrl: image.imageUrl, caption: image.caption });
      //     await newImage.save();
      //     imageArray.push(newImage);
      //   } else {
      //     const newImage = new Image({ imageUrl: image.imageUrl });
      //     await newImage.save();
      //     imageArray.push(newImage);
      //   }
      // }));
  
      // await category.save();
  
      res.status(200).json({ message: "Form data saved successfully." });
    } catch (err) {
      console.error("Error while saving form data:", err);
      res.status(500).json({ error: "An error occurred while saving the form data." });
    }
  });
  

exports.renderForm = (req, res, next) => {
  res.render("form");
};

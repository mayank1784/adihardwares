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
  const imageNames = req.files.map((file) => file.originalname);

  const directLinks = [];

  for (let i = 0; i < imageBuffers.length; i++) {
    const imageBuffer = imageBuffers[i];
    const removeCharactersAtEnd = (str) => str.replace(/\(\d+\)$/, '');
    const imageName = removeCharactersAtEnd(imageNames[i].split(".")[0]);
    

    try {
      const options = {
        apiKey: process.env.IMGBB_API, // Replace with your ImgBB API key
        base64string: imageBuffer.toString("base64"),
        name: imageName, // Replace with the desired image name
      };
      const response = await ImgbbUploader(options);
      // console.log(response);
      directLinks.push({
        imageurl: response.display_url,
        imagename: imageName,
      });
    } catch (error) {
      throw next(error);
    }
  }


  try {
    if (!categoryName) {
      throw new ErrorHandler("Category name is required", 500);
    }
    // console.log(subcategoryName && subsubcategoryName);

    switch (true) {
      case subcategoryName !== undefined && subsubcategoryName !== undefined:
        let subcategory;
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
          category = await Category.create({
            name: categoryName,
            subcategories: [],
          });
        }
        else{
          subcategory = await Subcategory.findOne({
            name: subcategoryName,
            _id: { $in: category.subcategories }, // Ensure the subcategory is within the subcategories array of the category
          });
        
        }

        if (subcategory===null) {
          subcategory = await Subcategory.create({
            name: subcategoryName,
            subSubcategories: [],
          });
          category.subcategories.push(subcategory._id);
          await category.save();
        }
        else{
         //Do Nothing 
        }

        const imageUrls = directLinks.map((imgObj) => ({
          url: imgObj.imageurl,
          caption: imgObj.imagename,
        }));
        const images = await Image.create({ imageUrl: imageUrls });


        let subsubcategory = await SubSubcategory.findOne({
          name: subsubcategoryName,
          _id: {$in: subcategory.subSubcategories}
        });

        let previousImageIds;
        if(subsubcategory===null){
        subsubcategory = await SubSubcategory.create({
          name: subsubcategoryName,
          images: images._id,
        });
        subcategory.subSubcategories.push(subsubcategory._id);
        await subcategory.save();
        }
        else{
          previousImageIds = subsubcategory.images;
          subsubcategory.images = images._id;
          // const deleter = new ImgbbUploader(process.env.IMGBB_API);
          // const imageToDelete = await Image.findById({_id: previousImageIds});
          // imageToDelete.imageUrl.forEach(async(image) => {
          // const deletionResult = await deleter.delete(image.url);
          // console.log(deletionResult);
          // })
          await Image.deleteOne({ _id: { $in: previousImageIds } });
          await subsubcategory.save();
        }
       
        break;


      case subcategoryName !== undefined && subsubcategoryName == undefined:
        let category2 = await Category.findOne({ name: categoryName });
        if (!category2) {
          category2 = await Category.create({
            name: categoryName,
            subcategories: [],
          });
          
        }
        const imageUrls2 = directLinks.map((imgObj) => ({
          url: imgObj.imageurl,
          caption: imgObj.imagename,
        }));
        const images2 = await Image.create({ imageUrl: imageUrls2 });
        // console.log("images2 created");
        let subcategory2 = await Subcategory.findOne({name: subcategoryName, _id:{$in: category2.subcategories}});
        // console.log("Subcategory found or not:",subcategory2 );
        let previousImageIds2;
        if(subcategory2===null){
        subcategory2 = await Subcategory.create({
          name: subcategoryName,
          images: images2._id,
          subSubcategories: []
        });
        category2.subcategories.push(subcategory2._id);
        await category2.save();
        }
        else{
          previousImageIds2 = subcategory2.images;
          subcategory2.images = images2;
          // const deleter = new ImgbbUploader(process.env.IMGBB_API);
          // const imageToDelete = await Image.findById({_id: previousImageIds2});
          // imageToDelete.imageUrl.forEach(async(image) => {
          // const deletionResult = await deleter.delete(image.url);
          // console.log(deletionResult);
          // })
          await Image.deleteOne({ _id: { $in: previousImageIds2 } });
          await subcategory2.save();
        }
        break;


      default:
        const imageUrls3 = directLinks.map((imgObj) => ({
          url: imgObj.imageurl,
          caption: imgObj.imagename,
        }));
        const images3 = await Image.create({ imageUrl: imageUrls3 });
        let category3 = await Category.findOne({name: categoryName});
        if(!category3){
        category3 = await Category.create({
          name: categoryName,
          images: images3._id,
        });}
        else{
          let previousImageIds3= category3.images;
          category3.images  = images3._id ;
          // const deleter = new ImgbbUploader(process.env.IMGBB_API);
          // const imageToDelete = await Image.findById({_id: previousImageIds3});
          // imageToDelete.imageUrl.forEach(async(image) => {
          // const deletionResult = await deleter.delete(image.url);
          // console.log(deletionResult);
          // })
          await Image.deleteOne({_id:{$in :previousImageIds3}});
          await category3.save();
        }
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
    user: req.user
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Internal Server Error");
  }
};

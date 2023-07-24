const mongoose = require("mongoose");

// Define schema for Image
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: function () {
      return this.parent().name; // Set default value to the parent subcategory/category name
    },
  },
});

// Define schema for Sub-Sub-Category
const subSubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [imageSchema], // Use the imageSchema here
});

// Define schema for Subcategory
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [imageSchema], // Use the imageSchema here
  subSubcategories: [subSubcategorySchema], // Added subSubcategories array
});

// Define schema for Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategories: [subcategorySchema],
});

// Export the models
module.exports = mongoose.model("Category",categorySchema);

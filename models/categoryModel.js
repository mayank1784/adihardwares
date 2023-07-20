const mongoose = require('mongoose');

// Define schema for Image
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  caption: String
});

// Define schema for Subcategory
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  images: [imageSchema]
});

// Define schema for Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subcategories: [subcategorySchema]
});

// Create models based on the schemas
const Category = mongoose.model('Category', categorySchema);

// Export the models
module.exports = {
  Category
};
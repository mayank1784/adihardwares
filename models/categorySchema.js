// categorySchema.js
const mongoose = require("mongoose");
const subcategorySchema = require("./subcategorySchema"); // Ensure the correct casing here

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" }], // Ensure the correct casing here
});

module.exports = mongoose.model("Category", categorySchema);

// subcategorySchema.js
const mongoose = require("mongoose");
const subSubcategorySchema = require("./subSubcategorySchema");
// const imageSchema = require("./imageSchema");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  subSubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubSubcategory" }],
});

module.exports = mongoose.model("Subcategory", subcategorySchema);

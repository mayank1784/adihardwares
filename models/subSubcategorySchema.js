// subSubcategorySchema.js
const mongoose = require("mongoose");
const imageSchema = require("./imageSchema");

const subSubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
});

module.exports = mongoose.model("SubSubcategory", subSubcategorySchema);

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageUrl: [
    {
      url: {
        type: String,
        required: true,
      },
      caption: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Image", imageSchema);

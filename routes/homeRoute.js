const express = require("express");
const bodyParser = require("body-parser");
const homeController = require("../controllers/homeController");
const router = express.Router();

router.route("/").get(homeController.renderHome);
router.route("/search/:category").get(homeController.renderProducts);



module.exports = router;
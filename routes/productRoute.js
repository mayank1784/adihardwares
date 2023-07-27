const express = require("express");
const { addProduct, renderForm } = require("../controllers/productController");
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const bodyParser = require("body-parser");


const router = express.Router();
const upload = multer();

router.route("/addProduct").post(isAuthenticatedUser, upload.array("inputimages"), addProduct).get(isAuthenticatedUser, renderForm);

module.exports = router;

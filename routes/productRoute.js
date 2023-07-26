const express = require("express");
const { addProduct, renderForm } = require("../controllers/productController");
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

const router = express.Router();
const upload = multer();

router.route("/addProduct").post(isAuthenticatedUser, addProduct).get(isAuthenticatedUser, renderForm);

module.exports = router;

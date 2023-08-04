const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserByAdmin,
  deleteUser,
  getLoginForm,
  renderRegisterationForm
} = require("../controllers/userController");
const multer = require("multer");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

const router = express.Router();
const upload = multer();

router
  .route("/admin/registerUser")
  .post(
    isAuthenticatedUser,
    authorizedRoles("admin"),
    upload.single("image"),
    registerUser
  ).get(isAuthenticatedUser,authorizedRoles("admin"),renderRegisterationForm);
  // router
  // .route("/admin/registerUser")
  // .post(
  //   upload.single("image"),
  //   registerUser
  // ).get(renderRegisterationForm);

  router.route("/login").post(loginUser).get(getLoginForm);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/users/resetPassword/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router
  .route("/me/update")
  .put(upload.single("image"), isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserByAdmin)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);
module.exports = router;

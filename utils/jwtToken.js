const dotenv = require("dotenv");
dotenv.config();
const sendToken = function (user, statusCode, res) {
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).redirect("/api/v1/addProduct");
  // .json({
  //   success: true,
  //   user,
  //   token,
  //});
};

module.exports = sendToken;
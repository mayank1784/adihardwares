const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error");
const ejs = require("ejs");
const multer = require("multer");
const path = require('path');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const connectDatabase = require("./config/database");

connectDatabase()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
//handling Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  process.exit(1);
});
// Create a storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname,"public")));

//Routes Imports
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const home = require("./routes/homeRoute");

app.use("/",home);

app.use("/api/v1",user);
app.use("/api/v1",product);


// app.listen(process.env.PORT || 3000, (req, res) => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
//Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});

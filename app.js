const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middlewares/error");
const ejs = require("ejs");
const multer = require("multer");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const connectDatabase = require("./config/database");

connectDatabase();
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
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static("public"));

//Routes Imports
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");

app.use("/api/v1",user);
app.use("/api/v1",product);

app.get("/", function (req, res) {
  res.render("home", {
    title: "Adi Hardwares - Door Handles | Modular Kitchen | Hinges",
  });
});
app.get("/index", (req, res) => {
  res.render("index");
});


app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
//Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});

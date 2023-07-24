const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const connectDatabase = require("./config/database");

connectDatabase();
//handling Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  process.exit(1);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render("home", { title: "Adi Hardwares - Door Handles | Modular Kitchen | Hinges" });
});
app.get("/index", (req,res)=> {
  res.render("index");
})

app.listen(process.env.PORT, (req,res) => {
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
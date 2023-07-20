const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/index", (req,res)=> {
  res.render("index");
})

app.listen(3000,(req,res) => {
    console.log('Server is running on port 3000');
});
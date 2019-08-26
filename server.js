
var express = require("express");
var exphbs = require(express-handlebars); 
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 5000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(routes);

mongoose.connect("mongodb://localhost/wsj", {useNewUrlParser: true})
var MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost/newsscrape";
mongoose.connect(MONGODB_URL);

  
  app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
  

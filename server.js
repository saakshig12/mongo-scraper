var express = require("express");
var exphbs = require("express-handlebars"); 
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("./models");

var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 5000;
var app = express();
var routes = require("./controller/controller");

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




app.get("/scrape", function (req, res) {
    axios.get("https://www.wsj.com/").then(function (response) {
      var $ = cheerio.load(response.data);
  
      $("article h2").each(function (i, element) {
        var result = {};
  
        result.title = $(this)
          .children("h3")
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.summary = $(this)
          .children("p")
          .text();
  
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
  
      res.send("Scrape Complete");
    });
  });


app.get("/articles", function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      })
  });
  
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note").then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      })
 
  });
  
  app.post("/note/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function (dbNote) {
      res.json(dbNote);
    })
    .catch(function (err) {
      res.json(err);
    })
 
  });



  
  app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
  

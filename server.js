//Adding all require packages

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 9999;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/cnn", {useNewUrlParser: true})

app.get("/scrape", function (req, res) {
    axios.get("https://www.cnn.com/").then(function (res) {
        var $ = cheerio.load(res.data);
        $("article h2").each(function (i, element) {
            var result = {};

            result.title = $(this)
            .children("h3")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href")

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            })
        })

        res.send("Srape Complete")
        // change this to refresh page with the new outputs.
    })
})
//test this much with a html page and then continue.....



// app.get()

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      }).catch(function (err) {
        res.json(err);
      })
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note").then(function (dbArticle) {
        res.json(dbArticle);
      }).catch(function (err) {
        res.json(err);
      })
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
      return db.Article.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    }).then(function (dbNote) {
      res.json(dbNote);
    }).catch(function (err) {
      res.json(err);
    })
 
  });
  
  // Start the server
  app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
  

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
mongoose.connect("mongodb://localhost/unit18Populater", {useNewUrlParser: true})

app.get("/scrape", function (req, res) {
    axios.get("link").then(function (res) {
        var $ = cheerio.load(res.data);
        $("article h2").each(function (i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
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


const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded(
    {
    extended: true
    }
));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = new mongoose.model("Article", articleSchema);

app.get("/articles", function(req,res){
    Article.find().then(function(foundArticles, err){
        //console.log(foundArticles);
        if(!err)
            res.send(foundArticles);
        else
            console.log(err);
    });
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
})




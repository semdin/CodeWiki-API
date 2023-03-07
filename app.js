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


app.route("/articles")
.get((req,res) => {
    Article.find().then(function(foundArticles, err){
        //console.log(foundArticles);
        if(!err)
            res.send(foundArticles);
        else
            console.log(err);
    });
})
.post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = Article(
        {
            title: req.body.title,
            content: req.body.content
        }
    );

    newArticle.save().then(function(savedArticle, err) {
        if (err) return handleError(err);
        // saved!
        else res.send("Successfully added a new article.");
      });

})
.delete((req, res) => {
    Article.deleteMany().then(function(deletedArticles, err){
        if(err) return handleError(err);
        else res.send("The articles are successfully deleted.");
    });
});

/*app.get("/articles", (req,res) => {
    Article.find().then(function(foundArticles, err){
        //console.log(foundArticles);
        if(!err)
            res.send(foundArticles);
        else
            console.log(err);
    });
});

app.post("/articles", (req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = Article(
        {
            title: req.body.title,
            content: req.body.content
        }
    );

    newArticle.save().then(function(savedArticle, err) {
        if (err) return handleError(err);
        // saved!
        else res.send("Successfully added a new article.");
      });

});

app.delete("/articles", (req, res) => {
    Article.deleteMany().then(function(deletedArticles, err){
        if(err) return handleError(err);
        else res.send("The articles are successfully deleted.");
    });
});*/


///Requests targetting a specific article

app.route("/articles/:articleTitle")
    .get((req,res) => {
        Article.findOne({title: req.params.articleTitle}).then(function(foundArticle, err){
            if(err){
                console.log("No articles matching that title was found.");
            }else{
                res.send(foundArticle);
            }
        });
    })

    .put((req,res) => {
        Article.updateOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}).then(function(updatedArticle, err){
            if(err){
                console.log("No articles updating that title was found.");
            }else{
                res.send("Successfully updated the article.");
            }
        });
    })

    .patch((req,res) => {
        Article.updateOne({title: req.params.articleTitle},
             //{$set: {title: req.body.title, content: req.body.content}})
             {$set: req.body})
             .then(function(updatedArticle, err){
            if(err){
                console.log("No articles updating that title was found.");
            }else{
                res.send("Successfully updated the article.");
            }
        });
    })

    .delete((req,res) => {
        Article.deleteOne({title: req.params.articleTitle})
        .then(function(deletedArticle, err){
            if(err){
                console.log("No articles deleting that title was found.");
            }else{
                res.send("Successfully deleted the article.");
            }
        });
    });

app.listen(3000, function(){
    console.log("Server started on port 3000");
})




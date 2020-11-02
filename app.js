var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express= require("express"),
    app = express();
   
    
    
// APP CONFIG
mongoose.connect('mongodb://localhost/restful_blog_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
 mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});
var Blog = mongoose.model("Blog", blogSchema);

// REST ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTES
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTES
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTES
app.post("/blogs", function(req, res){
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            // then redirect
            res.redirect("/blogs")
        }
    });
});

// SHOW ROUTES
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});



// EDIT ROUTES
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTES
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }else{
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTES
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});
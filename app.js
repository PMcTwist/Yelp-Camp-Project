const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const campground = require("./models/campground");


// Setup connection to MongoDB
mongoose.set("strictQuery", true);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () =>{
    console.log("Database connected!")
});

// Call and configure instance of express
const app = express()

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded(true));
// setup _method to be the query string for override
app.use(methodOverride("_method"));



// Render Home landing page
app.get("/", (req, res) =>{
    res.render("home")
});

// Render different pages for the campgrounds in a RESTful way
// List an index of camps in teh database
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
});

// Add a new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// Post to return new camp form too when compelte
app.post("/campgrounds", async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// Show details of camp based on dynamic ID from DB
app.get("/campgrounds/:id", async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

// Edit camp infos
// GET to render the edit page for input
app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

// POST request for taking the input data from the form
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete camp
app.delete("/campgrounds/:id", async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

// Return a listening string when the app sucessfully goes live
app.listen(3000, ()=> {
    console.log("Serving on port 3000")
});
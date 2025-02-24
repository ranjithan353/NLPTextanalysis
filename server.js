const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/bestsellers_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
    Name: String,
    Author: String,
    UserRating: Number,
    Reviews: Number,
    Price: Number,
    Year: Number,
    CustomerReviews: String,
    SentimentAnalysis: String,
    Genre: String,
});

const Book = mongoose.model("Book", bookSchema);

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Routes
app.get("/", async (req, res) => {
    const books = await Book.find();
    res.render("index", { books });
});

app.get("/visualization", async (req, res) => {
    res.render("visualization");
});

// API Routes for Charts
app.get("/api/genre-stats", async (req, res) => {
    const genreStats = await Book.aggregate([
        { $group: { _id: "$Genre", count: { $sum: 1 } } },
    ]);
    res.json(genreStats);
});

app.get("/api/top-authors", async (req, res) => {
    const yearlySales = await Book.aggregate([
        { $group: { _id: "$Author", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
    res.json(yearlySales);
});
app.get("/api/text-analysis", async (req, res) => {
    const textStats = await Book.aggregate([
        { $group: { _id: "$SentimentAnalysis", count: { $sum: 1 } } },
    ]);
    res.json(textStats);
});

app.get("/api/rating-distribution", async (req, res) => {
    const ratingDistribution = await Book.aggregate([
        { $group: { _id: "$UserRating", count: { $sum: 1 } } },
    ]);
    res.json(ratingDistribution);
});
app.get("/api/yearly-sales", async (req, res) => {
    const yearlySales = await Book.aggregate([
        { $group: { _id: "$Year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
    res.json(yearlySales);
});

app.get("/api/word-cloud", async (req, res) => {
    const wordCloudData = await Book.aggregate([
        { $unwind: "$CustomerReviews" },
        { $group: { _id: "$CustomerReviews", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
    ]);
    res.json(wordCloudData);
});

app.get('/upload', (req,res)=>{
    res.render("upload")
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

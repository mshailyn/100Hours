const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Todo = require('../models/Todo');
const Budget = require('../models/Budget');
const moment = require('moment');


module.exports = {
  getDashboard: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const todoItems = await Todo.find({userId:req.user.id})
      const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
      const todoToday = await Todo.find({ userId:req.user.id, date: moment().subtract(1, 'days').format("YYYY-MM-DD") })
      const overdue = await Todo.find({ userId:req.user.id, date: { $lte: moment().subtract(1, 'days').format("YYYY-MM-DD") } })
      const response = await fetch(process.env.URL);
      const quotes = await response.json()
      const thisBudget = await Budget.find({userId:req.user.id, date: moment().format("YYYY-MM") })
      let moneyLeft = thisBudget.length < 1 ? 0 :(thisBudget[0].monthBudget - (thisBudget[0].rent + thisBudget[0].utilities + thisBudget[0].car + thisBudget[0].gas + thisBudget[0].food + thisBudget[0].debt + thisBudget[0].subscription + thisBudget[0].savings) );
      res.render("dashboard.ejs", { posts: posts, user: req.user, todos: todoItems, left: itemsLeft,todoToday: todoToday, overdue: overdue, moneyLeft: moneyLeft, moment: moment, quote: quotes });
    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user, moment: moment});
    } catch (err) {
      console.log(err);
    }
  },
  getMoodboard: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id  });
      res.render("moodboard.ejs", { posts: posts, user: req.user, moment: moment});
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" });
      res.render("feed.ejs", { posts: posts, user: req.user, moment: moment});
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user, moment: moment });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  savePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      await Post.create({
        title: post.title,
        image: post.image,
        cloudinaryId: post.cloudinaryId,
        caption: post.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/moodboard");
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/dashboard");
    } catch (err) {
      res.redirect("/dashboard");
    }
  },
};

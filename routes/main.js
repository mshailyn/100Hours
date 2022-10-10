const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const budgetController = require('../controllers/budgets');
const todosController = require('../controllers/todos');  
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/dashboard", ensureAuth, postsController.getDashboard);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/moodboard", ensureAuth, postsController.getMoodboard)
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/makeBudget", ensureAuth, budgetController.getCreateBudget);
router.get("/editBudget/:date", ensureAuth, budgetController.getUpdateBudget);
router.get("/editTodo/:id", ensureAuth, todosController.getUpdateTodo)
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;

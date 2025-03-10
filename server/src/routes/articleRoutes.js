import express from "express";
import Article from "../models/Article.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all articles (protected)
// Admins see all articles; regular users see only approved articles.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { approved: true };
    const articles = await Article.find(filter).populate("author", "username email");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET a single article by ID (protected)
// Non-admin users can only access an article if it is approved.
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "username email");
    if (!article) return res.status(404).json({ message: "Article not found" });
    if (req.user.role !== "admin" && !article.approved) {
      return res.status(403).json({ message: "Article not approved" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET pending articles (admin-only)
router.get("/pending", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admins only" });
    }
    const pendingArticles = await Article.find({ approved: false }).populate("author", "username email");
    res.json(pendingArticles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// CREATE a new article (protected)
// If the creator is not an admin, the article is marked as pending (approved: false)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const approved = req.user.role === "admin" ? true : false;
    const newArticle = new Article({
      title,
      content,
      author: req.user.userId || req.user.id,
      approved,
    });
    await newArticle.save();
    res.status(201).json({ message: "Article created successfully", article: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// UPDATE an article (protected)
// Regular users updating an article reset its approval status to pending.
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    if (title) article.title = title;
    if (content) article.content = content;
    if (req.user.role !== "admin") {
      article.approved = false;
    }
    await article.save();
    res.json({ message: "Article updated", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE an article (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    await Article.deleteOne({ _id: req.params.id });
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// APPROVE an article (admin-only)
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admins only" });
    }
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    article.approved = true;
    await article.save();
    res.json({ message: "Article approved", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

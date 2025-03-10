import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  approved: { type: Boolean, default: false },  // New field: false by default (pending)
  createdAt:{ type: Date, default: Date.now },
});

const Article = mongoose.model("Article", ArticleSchema);
export default Article;

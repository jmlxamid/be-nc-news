const express = require("express");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComments,
  patchArticleVotes,
} = require("../controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postComments);
articlesRouter.patch("/:article_id", patchArticleVotes);

module.exports = articlesRouter;

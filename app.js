const express = require("express");
const app = express();
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers");

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404 - request not found" });
});

//ERROR HANDLERS
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ msg: err.msg || "Internal Server Error" });
});
module.exports = app;

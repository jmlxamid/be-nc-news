const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComments,
  patchArticleVotes,
  deleteComment,
  getUsers,
} = require("./controllers");

app.use(express.json());

const articlesRouter = require("./routes/articles");
const commentsRouter = require("./routes/comments");
const topicsRouter = require("./routes/topics");
const usersRouter = require("./routes/users");

app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);

app.get("/api", require("./controllers").getApi);

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

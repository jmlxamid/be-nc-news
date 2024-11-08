const { addComment } = require("@babel/types");
const endpoints = require("./endpoints.json");
const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComments,
  updateArticlesVotes,
  removeCommentById,
  fetchUsers,
  fetchUserByUsername,
} = require("./models");

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getApi(req, res) {
  res.status(200).send({ endpoints });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { sort_by, order } = req.query;
  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postComments(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addComments(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function patchArticleVotes(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return res.status(400).send({ msg: "Bad request" });
  }
  updateArticlesVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

function getUsers(req, res, next) {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComments,
  patchArticleVotes,
  deleteComment,
  getUsers,
  getUserByUsername,
};

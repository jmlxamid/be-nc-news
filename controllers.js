const { addComment } = require("@babel/types");
const endpoints = require("./endpoints.json");
const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComments,
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
  fetchArticles()
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

module.exports = {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComments,
};

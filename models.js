const db = require("./db/connection");

function fetchTopics() {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
}

function fetchArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

module.exports = { fetchTopics, fetchArticleById };

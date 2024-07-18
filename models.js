const db = require("./db/connection");

function fetchTopics() {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
}

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((returned) => {
      if (returned.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return returned.rows[0];
    });
}

function fetchArticles() {
  return db
    .query(
      `
    SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM
        articles
    LEFT JOIN
        comments ON articles.article_id = comments.article_id
    GROUP BY
        articles.article_id
    ORDER BY
        articles.created_at DESC;
    `
    )
    .then((body) => {
      return body.rows.map((row) => ({
        ...row,
        comment_count: Number(row.comment_count),
      }));
    });
}

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT
        comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comments not found for this article",
        });
      }
      return rows;
    });
}

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
};
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

function fetchArticles(sort_by = "created_at", order = "desc") {
  const validSortByColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrders = ["asc", "desc"];
  if (!validSortByColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
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
        ${sort_by} ${order}
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
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return db.query(
        `SELECT
          comments.comment_id,
          comments.votes,
          comments.created_at,
          comments.author,
          comments.body,
          comments.article_id,
          users.avatar_url
        FROM comments
        JOIN users
        ON comments.author = users.username
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC;`,
        [article_id]
      );
    })
    .then(({ rows: comments }) => {
      return comments;
    });
}

function fetchUserByUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return rows[0];
    });
}

function addComments(article_id, username, body) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return fetchUserByUsername(username).then(() => {
        return db
          .query(
            `INSERT INTO comments 
        (article_id, author, body) 
        VALUES ($1, $2, $3)
        RETURNING *`,
            [article_id, username, body]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      });
    });
}

function updateArticlesVotes(article_id, inc_votes) {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

function removeCommentById(comment_id) {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
      [comment_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
}

function fetchUsers() {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows }) => rows);
}

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  fetchUserByUsername,
  addComments,
  updateArticlesVotes,
  removeCommentById,
  fetchUsers,
};

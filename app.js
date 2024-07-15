const express = require("express");
const app = express();
const topics = require("./db/data/test-data/topics");

app.use(express.json());

app.get("/api/topics", (req, res) => {
  res.status(200).json(topics);
});

app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

module.exports = app;

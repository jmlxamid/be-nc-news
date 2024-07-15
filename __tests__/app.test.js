const request = require("supertest");
const app = require("../app");

describe("/api/topics", () => {
  it("GET /api/topics should respond with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  it("responds with 404 when handling errors", () => {
    return request(app)
      .get("/api/invalid")
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});

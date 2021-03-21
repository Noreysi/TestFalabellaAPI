/**
 * Pruebas a la API "https://enmanuelmedina.com/api/v1"
 *
 * @author Noreysi Escalona
 */
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;

chai.use(chaiHttp);
const url = "https://enmanuelmedina.com/api/v1";

let id;

/**
 * @description Prueba a la API para obtener todos los POST disponibles
 */
describe("GET all posts: ", () => {
  it("should get all posts", (done) => {
    chai
      .request(url)
      .get("/posts")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});

/**
 * @description Prueba a la API para crear un POST nuevo
 */
describe("POST create a new post: ", () => {
  it("should create a new post", (done) => {
    chai
      .request(url)
      .post("/posts")
      .send({ user_id: "1", title: "test title", content: "test Body" })
      .end(function (err, res) {
        expect(res).to.have.status(201);
        id = res.body["post"]["id"];
        chai
          .request(url)
          .get("/posts/" + id)
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("title").to.be.equal("test title");
          });
        done();
      });
  });
});

/**
 * @description Prueba a la API para crear un POST nuevo fallido
 */
describe("POST create a new post failed: ", () => {
  it("should send an error", (done) => {
    chai
      .request(url)
      .post("/posts")
      .send({})
      .end(function (err, res) {
        expect(res).to.have.status(422);
        expect(res.body["errors"]).to.have.property("title");
        done();
      });
  });
});

/**
 * @description Prueba a la API para obtener un post en especifico
 */
describe("GET an specific publication: ", () => {
  it("should get an specific publication", (done) => {
    chai
      .request(url)
      .get("/posts/" + id)
      .end(function (err, res) {
        expect(res.body).to.have.property("id").to.be.equal(id);
        expect(res).to.have.status(200);
        done();
      });
  });
});

/**
 * @description Prueba a la API para actualizar  un POST en especifico
 */
describe("PUT for update the title of post: ", () => {
  it("should update the title of post", (done) => {
    chai
      .request(url)
      .put("/posts/" + id)
      .send({ title: "test title new 2" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body["post"]).to.have.property("title").to.be.equal("test title new 2");
        done();
      });
  });
});

/**
 * @description Prueba a la API para eliminar un POST en especifico
 */
describe("DELETE  post : ", () => {
  it("should  delete an specific post", (done) => {
    chai
      .request(url)
      .del("/posts/" + id)
      .end(function (err, res) {
        expect(res).to.have.status(204);
        chai
          .request(url)
          .get("/posts/" + id)
          .end(function (err, res) {
            expect(res).to.have.status(404);
            done();
          });
      });
  });
});

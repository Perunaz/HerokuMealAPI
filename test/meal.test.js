const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

const assert = require("assert");
const server = require("../index.js");

describe("Database", function () {
    describe("createMeal", function () {
        it("TC-301 should add the given value to the database", (done) => {
            chai
                .request(server)
                .post("/api/studenthome/0/meal")
                .send({
                    name: "Lasagne",
                    info: "Some sort of oven dish with pasta, cheese, minced meat and tomato"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("status", "result");

                    let {
                        status,
                        result
                    } = res.body;

                    status.should.be.an("string");
                    result.should.be.a("object");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("createMeal", function () {
        it("TC-301-2 should give error 400 for missing element", (done) => {
            chai
                .request(server)
                .post("/api/studenthome/0/meal")
                .send({
                    // name: "Lasagne", missing
                    info: "Some sort of oven dish with pasta, cheese, minced meat and tomato"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("error", "message");

                    let {
                        error,
                        message
                    } = res.body;
                    error.should.be.a("string");
                    message.should.be.a("string").that.equals("An element is missing!");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("updateMeal", function () {
        it("TC-302 should replace the given value with the matching home and mealId", (done) => {
            chai
                .request(server)
                .put("/api/studenthome/0/meal/0")
                .send({
                    name: "Lasagne1",
                    info: "Some sort of oven dish with pasta, cheese, minced meat and tomato"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("status", "result");

                    let {
                        status,
                        result
                    } = res.body;

                    status.should.be.an("string");
                    result.should.be.a("object");

                    let {
                        name,
                        meal_id
                    } = result;

                    name.should.be.a("string").that.equals("Lasagne1");
                    meal_id.should.be.a("number").that.equals(0);

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("updateMeal", function () {
        it("TC-302-1 should give error 400 for missing element", (done) => {
            chai
                .request(server)
                .put("/api/studenthome/0/meal/0")
                .send({
                    // name: "Lasagne", missing
                    info: "Some sort of oven dish with pasta, cheese, minced meat and tomato"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("error", "message");

                    let {
                        error,
                        message
                    } = res.body;
                    error.should.be.a("string");
                    message.should.be.a("string").that.equals("An element is missing!");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("updateMeal", function () {
        it("TC-302-2 should not be able to find home", (done) => {
            chai
                .request(server)
                .put("/api/studenthome/0/meal/99")
                .send({
                    name: "Lasagne",
                    info: "Some sort of oven dish with pasta, cheese, minced meat and tomato"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(404);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("error", "message");

                    let {
                        error,
                        message
                    } = res.body;

                    error.should.be.a("string");
                    message.should.be.a("string").that.equals("mealId 99 not found!");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("getMeals", function () {
        it("TC-303 should give a list of all meals from a home", (done) => {
            chai
                .request(server)
                .get("/api/studenthome/0/meal")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("status", "result");

                    let {
                        status,
                        result
                    } = res.body;

                    status.should.be.an("string");
                    result.should.be.a("array");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("getMeal", function () {
        it("TC-304 should get meal from a home", (done) => {
            chai
                .request(server)
                .get("/api/studenthome/0/meal/0")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("status", "result");

                    let {
                        status,
                        result
                    } = res.body;

                    status.should.be.an("string");
                    result.should.be.a("object");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("getMeal", function () {
        it("TC-304-1 should give 404 error because meal doesn't exist", (done) => {
            chai
                .request(server)
                .get("/api/studenthome/0/meal/99")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(404);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("error", "message");

                    let {
                        error,
                        message
                    } = res.body;

                    error.should.be.a("string");
                    message.should.be.a("string").that.equals("mealId 99 not found!");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("deleteMeal", function () {
        it("TC-305 should delete meal", (done) => {
            chai
                .request(server)
                .delete("/api/studenthome/0/meal/0")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("result");

                    let {
                        result
                    } = res.body;

                    result.should.be.a("string").that.equals("deleted");

                    done();
                })
        });
    });
});

describe("Database", function () {
    describe("deleteMeal", function () {
        it("TC-305-2 should give 404 error because meal doesn't exist", (done) => {
            chai
                .request(server)
                .delete("/api/studenthome/0/meal/99")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(404);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("error", "message");

                    let {
                        error,
                        message
                    } = res.body;

                    error.should.be.a("string");
                    message.should.be.a("string").that.equals("mealId 99 not found!");

                    done();
                })
        });
    });
});
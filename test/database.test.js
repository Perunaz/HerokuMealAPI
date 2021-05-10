const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

const assert = require("assert");
const server = require("../index.js");

describe("Database", function () {
    describe("create", function () {
        it("TC-201 should add the given value to the database", (done) => {
            chai
            .request(server)
            .post("/api/studenthome")
            .send({
                name: "Studenthuis1",
                street_name: "Rembrandtlaan",
                number: 13,
                postal_code: "1234AB",
                city: "Breda",
                phone_number: "0628283414"
            })
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                result.should.be.an("object");
                status.should.be.a("string");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("create", function () {
        it("TC-201-2 value is missing", (done) => {
            chai
            .request(server)
            .post("/api/studenthome")
            .send({
                // name: "Studenthuis1", name is missing
                street_name: "Rembrandtlaan",
                number: 13,
                postal_code: "1234AB",
                city: "Breda",
                phone_number: "0628283414"
            })
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(400);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("error", "message");

                let {error, message} = res.body;
                error.should.be.a("string");
                message.should.be.a("string").that.equals("An element is missing!");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("create", function () {
        it("TC-201-3 home already exists", (done) => {
            chai
            .request(server)
            .post("/api/studenthome")
            .send({
                name: "Studenthuis1",
                street_name: "Rembrandtlaan",
                number: 28,
                postal_code: "1234AB",
                city: "Breda",
                phone_number: "0628283414"
            })
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(400);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("error", "message");

                let {error, message} = res.body;
                error.should.be.a("string");
                message.should.be.a("string").that.equals("This studenthome already exists");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("get", function () {
        it("TC-202 should receive list of studenthomes", (done) => {
            chai
            .request(server)
            .get("/api/studenthome")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                status.should.be.a("string");
                result.should.be.an("array");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("get", function () {
        it("TC-202-1 should receive list of studenthomes in the city Breda", (done) => {
            chai
            .request(server)
            .get("/api/studenthome?city=Breda")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                status.should.be.a("string");
                result.should.be.an("array");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("get", function () {
        it("TC-202-2 should receive list of studenthomes with the name Studenthuis1", (done) => {
            chai
            .request(server)
            .get("/api/studenthome?name=Studenthuis1")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                status.should.be.a("string");
                result.should.be.an("array");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("getById", function () {
        it("TC-203 should receive one studenthome", (done) => {
            chai
            .request(server)
            .get("/api/studenthome/0")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                status.should.be.a("string");
                result.should.be.an("object");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("getById", function () {
        it("TC-203-1 should receive 404 error", (done) => {
            chai
            .request(server)
            .get("/api/studenthome/99")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(404);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("error", "message");

                let {error, message} = res.body;
                error.should.be.an("string");
                message.should.be.a("string").that.equals("HomeId 99 not found");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("updateHome", function () {
        it("TC-204 should update studenthome", (done) => {
            chai
            .request(server)
            .put("/api/studenthome/0")
            .send({
                name: "Studenthuis1",
                street_name: "Rembrandtlaan",
                number: 35,
                postal_code: "1234AB",
                city: "Breda",
                phone_number: "0628283414"
            })
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                status.should.be.a("string");
                result.should.be.an("object");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("updateHome", function () {
        it("TC-204-2 should give error 400 for missing info", (done) => {
            chai
            .request(server)
            .put("/api/studenthome/0")
            .send({
                // name: "Studenthuis1", missing
                street_name: "Rembrandtlaan",
                number: 35,
                postal_code: "1234AB",
                city: "Breda",
                phone_number: "0628283414"
            })
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(400);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("error", "message");

                let {error, message} = res.body;
                error.should.be.a("string");
                message.should.be.a("string").that.equals("An element is missing!");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("updateHome", function () {
        it("TC-204-3 should give error 404 because there is no home", (done) => {
            chai
            .request(server)
            .put("/api/studenthome/99")
            .send({
                name: "Studenthuis1",
                street_name: "Rembrandtlaan",
                number: 35,
                postal_code: "1234AB",
                city: "Breda",
                phone_number: "0628283414"
            })
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(404);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("error", "message");

                let {error, message} = res.body;
                error.should.be.a("string");
                message.should.be.a("string").that.equals("HomeId 99 not found");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("deleteHome", function () {
        it("TC-205 should give a message that deletion was successful", (done) => {
            chai
            .request(server)
            .delete("/api/studenthome/0")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("status", "result");

                let {status, result} = res.body;
                status.should.be.a("string");
                result.should.be.a("string").that.equals("deleted");

                done();
            })
        });
    });
});

describe("Database", function () {
    describe("deleteHome", function () {
        it("TC-205-1 should give a message that deletion was successful", (done) => {
            chai
            .request(server)
            .delete("/api/studenthome/99")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(404);
                res.should.be.an("object");

                res.body.should.be.an("object").that.has.all.keys("error", "message");

                let {error, message} = res.body;
                error.should.be.a("string");
                message.should.be.a("string").that.equals("HomeId 99 not found");

                done();
            })
        });
    });
});
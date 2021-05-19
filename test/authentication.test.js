process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome_testdb";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

const assert = require("assert");
const server = require("../index.js");
const logger = require('../src/config/config').logger;
const jwt = require('jsonwebtoken')
const pool = require('../src/config/database-config');

const CLEAR_STUDENTHOME_TABLE = 'DELETE IGNORE FROM studenthome;';
const CLEAR_USER_TABLE = 'DELETE IGNORE FROM user;'
const CLEAR_DB = CLEAR_STUDENTHOME_TABLE + CLEAR_USER_TABLE

const INSERT_USER =
    'INSERT INTO `user` (`ID`, `First_Name`, `Last_Name`, `Email`, `Student_Number`, `Password` ) VALUES' +
    '(1, "first", "last", "name@server.nl","1234567", "secret");'

const INSERT_STUDENTHOMES =
    "INSERT INTO `studenthome` (`Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES" +
    "('Princenhage', 'Princenhage', 11, 1,'4706RX','061234567891','Breda')," +
    "('Haagdijk 23', 'Haagdijk', 4, 1, '4706RX','061234567891','Breda')," +
    "('Den Hout', 'Lovensdijkstraat', 61, 1, '4706RX','061234567891','Den Hout')," +
    "('Den Dijk', 'Langendijk', 63, 1, '4706RX','061234567891','Breda')," +
    "('Lovensdijk', 'Lovensdijkstraat', 62, 1, '4706RX','061234567891','Breda')," +
    "('Van Schravensteijn', 'Schravensteijnseweg', 23, 1, '4706RX','061234567891','Breda');";

beforeEach((done) => {
    pool.query(CLEAR_DB, (err, rows, fields) => {
        if (err) {
            logger.error(`before CLEARING tables: ${err}`)
            done(err)
        } else {
            pool.query(INSERT_USER, (err, rows, fields) => {
                if (err) {
                    // logger.error(`before INSERTING tables: ${err}`)
                    done(err)
                } else {
                    logger.info('before FINISHED')
                    done()
                }
            });
        }
    })
})

afterEach((done) => {
    pool.query(CLEAR_DB, (err, rows, fields) => {
        if (err) {
            console.log(`after error: ${err}`)
            done(err)
        } else {
            logger.info('After FINISHED')
            done()
        }
    })
})

describe("Authentication", function () {
    describe("create", function () {
        it("TC-101 should add the given value to the database", (done) => {
            chai
                .request(server)
                .post("/api/register")
                .send({
                    firstname: "Caelan",
                    lastname: "van Eijnsbergen",
                    email: "bla@gmail.com",
                    studentnr: "2153459",
                    password: "secret"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object");

                    res.body.should.have.property("token").which.is.a("string")

                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("create", function () {
        it("TC-101-2 should return an error on POST request", (done) => {
            chai
                .request(server)
                .post("/api/register")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");

                    res.body.should.be.an("object");

                    res.body.should.have.property("message").which.is.a("string")

                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("create", function () {
        it("TC-101-3 should return an error on POST request", (done) => {
            chai
                .request(server)
                .post("/api/register")
                .send({
                    firstname: "Caelan",
                    lastname: "van Eijnsbergen",
                    email: "name@server.nl",
                    studentnr: "2153459",
                    password: "secret"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");

                    res.body.should.be.an("object");

                    let {
                        message
                    } = res.body;

                    message.should.be.a("string").that.equals("This email has already been taken.");

                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("login", function () {
        it("TC-102 should return new token with user info", (done) => {
            chai
                .request(server)
                .post("/api/login")
                .send({
                    email: "name@server.nl",
                    password: "secret"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("id", "firstName", "lastName", "emailAdress", "token");

                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("login", function () {
        it("TC-102-2 should return an error on POST request", (done) => {
            chai
                .request(server)
                .post("/api/login")
                .send({
                    email: "name@server.nl",
                    //password: "secret"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("datetime", "error");
                    
                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("login", function () {
        it("TC-102-3 should return an error on POST request", (done) => {
            chai
                .request(server)
                .post("/api/login")
                .send({
                    email: "caelan@server.nl",
                    password: "secret"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(401);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("datetime", "message");
                    
                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("login", function () {
        it("TC-102-4 should return an error on POST request", (done) => {
            chai
                .request(server)
                .post("/api/login")
                .send({
                    email: "name@server.nl",
                    password: "secret1"
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(401);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("datetime", "message");
                    
                    done();
                })
        });
    });
});

describe("Authentication", function () {
    describe("login", function () {
        it("TC-103 should return info about api", (done) => {
            chai
                .request(server)
                .get("/api/info")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");

                    res.body.should.be.an("object").that.has.all.keys("student_name", "student_number", "description", "sonarqube_link");

                    done();
                })
        });
    });
});
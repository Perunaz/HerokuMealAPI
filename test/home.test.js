const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

const assert = require("assert");
const server = require("../index.js");
const mysql = require('mysql');
const logger = require('../src/config/config').logger;
const dbconfig = require('../src/config/config').dbconfig;

const pool = mysql.createPool(dbconfig);

pool.on('connection', function (connection) {
    logger.trace('Database connection established')
})

pool.on('acquire', function (connection) {
    logger.trace('Database connection aquired')
})

pool.on('release', function (connection) {
    logger.trace('Database connection released')
})

const CLEAR_STUDENTHOME_TABLE = 'DELETE IGNORE FROM studenthome;';

const INSERT_STUDENTHOMES =
    "INSERT INTO `studenthome` (`Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES" +
    "('Princenhage', 'Princenhage', 11, 1,'4706RX','061234567891','Breda')," +
    "('Haagdijk 23', 'Haagdijk', 4, 4, '4706RX','061234567891','Breda')," +
    "('Den Hout', 'Lovensdijkstraat', 61, 3, '4706RX','061234567891','Den Hout')," +
    "('Den Dijk', 'Langendijk', 63, 4, '4706RX','061234567891','Breda')," +
    "('Lovensdijk', 'Lovensdijkstraat', 62, 2, '4706RX','061234567891','Breda')," +
    "('Van Schravensteijn', 'Schravensteijnseweg', 23, 3, '4706RX','061234567891','Breda');";

beforeEach((done) => {
    pool.query(CLEAR_STUDENTHOME_TABLE, (err, rows, fields) => {
        if (err) {
            logger.error(`before CLEARING tables: ${err}`)
            done(err)
        } else {
            logger.info('before FINISHED')
            done()
        }
    })
})

afterEach((done) => {
    pool.query(CLEAR_STUDENTHOME_TABLE, (err, rows, fields) => {
        if (err) {
            console.log(`after error: ${err}`)
            done(err)
        } else {
            logger.info('After FINISHED')
            done()
        }
    })
})


describe("Database", function () {
    describe("create", function () {

        it("TC-201 should add the given value to the database", (done) => {
            chai
                .request(server)
                .post("/api/studenthome")
                .send({
                    Name: "Haagdijk 23",
                    Address: "Leenweer",
                    House_Nr: 456,
                    UserID: 4,
                    Postal_Code: "4703RD",
                    Telephone: "061234567891",
                    City: "Sliedrecht"
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
                    //Name: "Haagdijk 24",
                    Address: "Leenweer",
                    House_Nr: 88,
                    UserID: 4,
                    Postal_Code: "4705RD",
                    Telephone: "061234567891",
                    City: "Sliedrecht"
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
    describe("create", function () {
        it("TC-201-3 home already exists", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .post("/api/studenthome")
                        .send({
                            Name: "Haagdijk 23",
                            Address: "Haagdijk",
                            House_Nr: 4,
                            UserID: 4,
                            Postal_Code: "4706RX",
                            Telephone: "061234567891",
                            City: "Breda"
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
                            message.should.be.a("string").that.equals("This home already exists");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("get", function () {
        it("TC-202 should receive list of studenthomes", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {

                    chai
                        .request(server)
                        .get("/api/studenthome")
                        .end((err, res) => {
                            assert.ifError(err);
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("status", "result");

                            let {
                                status,
                                result
                            } = res.body;
                            status.should.be.a("string");
                            result.should.be.an("array");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("get", function () {
        it("TC-202-1 should receive list of studenthomes in the city Breda", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {

                    chai
                        .request(server)
                        .get("/api/studenthome?city=Breda")
                        .end((err, res) => {
                            assert.ifError(err);
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("status", "result");

                            let {
                                status,
                                result
                            } = res.body;
                            status.should.be.a("string");
                            result.should.be.an("array");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("get", function () {
        it("TC-202-2 should receive studenthome with the name Haagdijk 23", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .get("/api/studenthome?name=Haagdijk 23")
                        .end((err, res) => {
                            assert.ifError(err);
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("status", "result");

                            let {
                                status,
                                result
                            } = res.body;
                            status.should.be.a("string");
                            result.should.be.an("array");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("getById", function () {
        it("TC-203 should receive one studenthome", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {

                    chai
                        .request(server)
                        .get("/api/studenthome/" + result.insertId)
                        .end((err, res) => {
                            assert.ifError(err);
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("status", "result");

                            let {
                                status,
                                result
                            } = res.body;
                            status.should.be.a("string");
                            result.should.be.an("array");

                            done();
                        })
                }
            });
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

                    let {
                        error,
                        message
                    } = res.body;
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
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .put("/api/studenthome/" + result.insertId)
                        .send({
                            Name: "Haagdijk 33",
                            Address: "Leenweer",
                            House_Nr: 45,
                            Postal_Code: "4705RD",
                            Telephone: "061234567891",
                            City: "Sliedrecht"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("status", "result");

                            let {
                                status,
                                result
                            } = res.body;
                            status.should.be.a("string");
                            result.should.be.an("object");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("updateHome", function () {
        it("TC-204-2 should give error 400 for missing info", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .put("/api/studenthome/" + result.insertId)
                        .send({
                            name: "Studenthuis1"
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
                }
            });
        });
    });
});

describe("Database", function () {
    describe("updateHome", function () {
        it("TC-204-3 should give error 404 because there is no home", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .put("/api/studenthome/" + result.insertId + 10)
                        .send({
                            Name: "Studenthuis1"
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
                            message.should.be.a("string").that.equals("Home doesn't exist");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("deleteHome", function () {
        it("TC-205 should give a message that deletion was successful", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .delete("/api/studenthome/" + result.insertId)
                        .end((err, res) => {
                            assert.ifError(err);
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("status", "result");

                            let {
                                status,
                                result
                            } = res.body;
                            status.should.be.a("string");
                            result.should.be.a("object");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("deleteHome", function () {
        it("TC-205-1 should give a message that home was not found", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .delete("/api/studenthome/" + result.insertId + 10)
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
                            message.should.be.a("string").that.equals("Home doesn't exist");

                            done();
                        })
                }
            });
        });
    });
});
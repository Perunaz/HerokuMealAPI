process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome_testdb";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
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

const CLEAR_STUDENTHOME_TABLE = 'DELETE IGNORE FROM studenthome;'

const INSERT_STUDENTHOMES =
    "INSERT INTO `studenthome` (`Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES" +
    "('Princenhage', 'Princenhage', 11, 1,'4706RX','061234567891','Breda')," +
    "('Haagdijk 23', 'Haagdijk', 4, 4, '4706RX','061234567891','Breda')," +
    "('Den Hout', 'Lovensdijkstraat', 61, 3, '4706RX','061234567891','Den Hout')," +
    "('Den Dijk', 'Langendijk', 63, 4, '4706RX','061234567891','Breda')," +
    "('Lovensdijk', 'Lovensdijkstraat', 62, 2, '4706RX','061234567891','Breda')," +
    "('Van Schravensteijn', 'Schravensteijnseweg', 23, 3, '4706RX','061234567891','Breda');"

const INSERT_MEAlS =
    "INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES" +
    "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 4, 4, 3)";

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
    describe("createMeal", function () {
        it("TC-301 should add the given value to the database", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .post("/api/studenthome/" + result.insertId + "/meal")
                        .send({
                            Name: "Lasagne",
                            Description: "Some sort of oven dish with pasta, cheese, minced meat and tomato",
                            Ingredients: "Pasta, tomatensaus, gehakt",
                            Allergies: "Lactose",
                            OfferedOn: "2020-01-01 10:10",
                            Price: 8.00,
                            MaxParticipants: 6
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
                }
            });
        });
    });
});

describe("Database", function () {
    describe("createMeal", function () {
        it("TC-301-2 should give error 400 for missing element", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .post("/api/studenthome/3/meal")
                        .send({
                            //Name: "Lasagne",
                            Description: "Some sort of oven dish with pasta, cheese, minced meat and tomato",
                            Ingredients: "Pasta, tomatensaus, gehakt",
                            Allergies: "Lactose",
                            OfferedOn: "2020-01-01 10:10",
                            Price: 8.00,
                            MaxParticipants: 6
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
    describe("updateMeal", function () {
        it("TC-302 should replace the given value with the matching home and mealId", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result1) => {
                if (error) logger.debug(error)
                if (result1) {
                    pool.query("INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES" +
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 4, 4, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                                chai
                                    .request(server)
                                    .put("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
                                    .send({
                                        Name: "Salade",
                                        Description: "Pasta, cheese, minced meat and tomato",
                                        Ingredients: "Pasta, tomaten, gehakt",
                                        Allergies: "Lactose",
                                        OfferedOn: "2020-01-01 10:10",
                                        Price: 8.00,
                                        MaxParticipants: 6
                                    })
                                    .end((err, res) => {
                                        assert.ifError(err);
                                        res.should.have.status(200);
                                        res.should.be.an("object");

                                        done();
                                    })
                            }
                        });
                }
            });
        });
    });
});

describe("Database", function () {
    describe("updateMeal", function () {
        it("TC-302-1 should give error 400 for missing element", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result1) => {
                if (error) logger.debug(error)
                if (result1) {
                    pool.query("INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES" +
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 4, 4, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                                chai
                                    .request(server)
                                    .put("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
                                    .send({
                                        name: "Lasagne"
                                    })
                                    .end((err, res) => {
                                        assert.ifError(err);
                                        res.should.have.status(400);
                                        res.should.be.an("object");

                                        done();
                                    })
                            }
                        });
                }
            });
        });
    });
});

describe("Database", function () {
    describe("updateMeal", function () {
        it("TC-302-2 should not be able to find meal", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .put("/api/studenthome/" + result.insertId + "/meal/99")
                        .send({
                            Name: "Lasagne",
                            Description: "Some sort of oven dish with pasta, cheese, minced meat and tomato",
                            Ingredients: "Pasta, tomatensaus, gehakt",
                            Allergies: "Lactose",
                            OfferedOn: "2020-01-01 10:10",
                            Price: 8.00,
                            MaxParticipants: 6
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
                            message.should.be.a("string").that.equals("Meal doesn't exist");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("getMeals", function () {
        it("TC-303 should give a list of all meals from a home", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result1) => {
                if (error) logger.debug(error)
                if (result1) {
                    pool.query("INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES" +
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 4, 4, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                    chai
                        .request(server)
                        .get("/api/studenthome/" + result1.insertId + "/meal/")
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
                    }
                });
                }
            });
        });
    });
});

describe("Database", function () {
    describe("getMeal", function () {
        it("TC-304 should get meal from a home", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result1) => {
                if (error) logger.debug(error)
                if (result1) {
                    pool.query("INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES" +
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 4, 4, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                    chai
                        .request(server)
                        .get("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
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
                    }
                });
                }
            });
        });
    });
});

describe("Database", function () {
    describe("getMeal", function () {
        it("TC-304-1 should give 404 error because meal doesn't exist", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .get("/api/studenthome/" + result.insertId + "/meal/99")
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
                            message.should.be.a("string").that.equals("Meal doesn't exist");

                            done();
                        })
                }
            });
        });
    });
});

describe("Database", function () {
    describe("deleteMeal", function () {
        it("TC-305 should delete meal", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result1) => {
                if (error) logger.debug(error)
                if (result1) {
                    pool.query("INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES" +
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 4, 4, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                    chai
                        .request(server)
                        .get("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
                        .end((err, res) => {
                            assert.ifError(err);
                            res.should.have.status(200);
                            res.should.be.an("object");

                            res.body.should.be.an("object").that.has.all.keys("result", "status");

                            let {
                                result
                            } = res.body;

                            result.should.be.a("array");

                            done();
                        })
                    }
                });
                }
            });
        });
    });
});

describe("Database", function () {
    describe("deleteMeal", function () {
        it("TC-305-2 should give 404 error because meal doesn't exist", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .delete("/api/studenthome/3/meal/1")
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
                            message.should.be.a("string").that.equals("Meal doesn't exist");

                            done();
                        })
                }
            });
        });
    });
});
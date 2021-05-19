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
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM meal;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_STUDENTHOME_TABLE + CLEAR_USER_TABLE;

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
    "('Van Schravensteijn', 'Schravensteijnseweg', 23, 1, '4706RX','061234567891','Breda');"

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


describe("Database", function () {
    describe("createMeal", function () {
        it("TC-301 should add the given value to the database", (done) => {
            pool.query(INSERT_STUDENTHOMES, (error, result) => {
                if (error) logger.debug(error)
                if (result) {
                    chai
                        .request(server)
                        .post("/api/studenthome/" + result.insertId + "/meal")
                        .set('authorization', 'Bearer ' + jwt.sign({
                            id: 1
                        }, 'secret'))
                        .send({
                            Name: "Lasagne",
                            Description: "Some sort of oven dish with pasta, cheese, minced meat and tomato",
                            Ingredients: "Pasta, tomatensaus, gehakt",
                            Allergies: "Lactose",
                            OfferedOn: "2020-01-01 10:10",
                            Price: 8.00,
                            MaxParticipants: 6,
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
                        .set('authorization', 'Bearer ' + jwt.sign({
                            id: 1
                        }, 'secret'))
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
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 1, 1, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                                chai
                                    .request(server)
                                    .put("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
                                    .set('authorization', 'Bearer ' + jwt.sign({
                                        id: 1
                                    }, 'secret'))
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
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 1, 1, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                                chai
                                    .request(server)
                                    .put("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
                                    .set('authorization', 'Bearer ' + jwt.sign({
                                        id: 1
                                    }, 'secret'))
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
                        .set('authorization', 'Bearer ' + jwt.sign({
                            id: 1
                        }, 'secret'))
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
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 1, 1, " + result1.insertId + ")", (error, result2) => {
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
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 1, 1, " + result1.insertId + ")", (error, result2) => {
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
                        "('Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-01 10:10', 5.50, 1, 1, " + result1.insertId + ")", (error, result2) => {
                            if (error) logger.debug(error)
                            if (result2) {
                                chai
                                    .request(server)
                                    .get("/api/studenthome/" + result1.insertId + "/meal/" + result2.insertId)
                                    .set('authorization', 'Bearer ' + jwt.sign({
                                        id: 1
                                    }, 'secret'))
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
                        .set('authorization', 'Bearer ' + jwt.sign({
                            id: 1
                        }, 'secret'))
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
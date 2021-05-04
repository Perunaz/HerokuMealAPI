let logger = require('tracer').console();
let databaseMaxIndex = 0;

let database = {
  db: [],
  info: "This is the database",

  add(home, callback) {
      home.home_id = databaseMaxIndex++;
      this.db.push(home);
      // no error occurred
      callback(undefined, home);
    },

  getAll(callback) {
      callback(undefined, database.db);
  },

  getById(index, callback) {
    logger.log("database.getById called");
    const hometoreturn = database.db.find((home) => home.home_id == index);
    // no error occurred
    if(!hometoreturn) {
      const err = { message: "Id doesn't exist", errCode: 404 };
      callback(err, undefined);
    }
    callback(undefined, hometoreturn);
  },

  delete(index, callback) {
    // Gebruik de array.spice() functie om 1 item (op basis van de index!) uit het array te verwijderern
    // https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    const err = { message: "delete not implemented yet", errCode: 501 };
    callback(err, undefined);
  },
};

const home = {
  name: "Studenthuis1",
  street_name: "Rembrandtlaan",
  street_number: 28,
  postal_code: "1234AB",
  city: "Breda",
  phone_number: "0612345678"
};

database.add(home, (err, result) => {
  logger.log("Added single item: ", result);
});

module.exports = database;

  
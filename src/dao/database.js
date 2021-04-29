const databaseMaxIndex = 0;

let database = {
  db: [],
  info: "This is the database",

  add(home, callback) {
      home.homeId = databaseMaxIndex++;
      this.db.push(home);
      // no error occurred
      callback(undefined, item);
    },

  getAll(callback) {
    setTimeout(() => {
      callback(undefined, database.db);
    }, timeToWait);
  },

  getById(index) {
    const hometoreturn = db.find((home) => home.homeid == index);
    return hometoreturn;
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
  town: "Breda",
  phone_number: "0612345678"
};

database.add(movie, (err, result) => {
  console.log("Added single item: ", result);
});

module.exports = database;

  
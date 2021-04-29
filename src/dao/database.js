const databaseMaxIndex = 0;

module.exports = {
    db: [],
    info: "This is the database",
  
    // Gebruik deze add() om vanuit je routes items in de in-memory database te zetten.
    add(item, callback) {
        databaseMaxIndex++;
        this.db.push(item);
        callback("success", undefined);
      },
  
    // get() om één item uit de database te lezen.
    get(index, callback) {
        // get item from array
        const itemNotFound = true;
        if (itemNotFound) {
          callback(undefined, "error, item not found");
        } else {
          callback({ name: "item" }, undefined);
        }
      }
    }
  
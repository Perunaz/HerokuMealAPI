module.exports = {
    db: [],
    info: "This is the database",

    add(item, callback) {
        setTimeout(() => {
            this.db.push(item);
            callback("success", undefined);
        }, 500)
    },

    get(index) {
        setTimeout(() => {
            // get item from array
            callback("success", undefined);
        }, 500)
    },
};
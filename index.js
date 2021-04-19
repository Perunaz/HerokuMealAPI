const express = require("express");
const app = express();
const importData = require("./data.json");
const hostname = '127.0.0.1'
let port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(importData);
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
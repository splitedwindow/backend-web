require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const Mongo = require('./setup/mongoose');

const SalesController = require('./api/sales.api');

const { setupDb } = require('./setup/mongoose');

PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const setup = async() => {
  await Mongo.setupDb(process.env.DB_URI);

  app.use(SalesController.router);

  app.listen(PORT, () => {
    console.log("Server was started at ", PORT);
  });
}


setup();
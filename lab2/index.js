const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { setupDb } = require("./setup/mongoose");

const UsersController = require('./api/user.api');
const LinksController = require('./api/links.api');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const setup = async () => {

  app.use(UsersController.router);
  app.use(LinksController.router);
  
  await setupDb(process.env.MONGO_DB_URI);


  // app.use(Middleware.authorization);

  app.listen(process.env.PORT, () => {
    console.log(
      `server started port: ${process.env.PORT}`
    );
  });

  app.get("/", (req, res) => {
    res.send({
      msg: 'Hello',
      user: { } ,
    });
  });

};

setup();

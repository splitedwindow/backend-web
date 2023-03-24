const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { setupDb } = require("./setup/mongoose");

const Users = require('./models/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const setup = async () => {
  await setupDb(process.env.MONGO_DB_URI);

  let users = [
    { name : 'Bork', age: 22 },
    { name : 'Mike', age: 44 },
    { name : 'John', age: 55 },
  ]

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

  app.get("/users", (req, res) => {
    res.send(users);
  })

  app.post("/", (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).send("User created");
  });
};

const awesome_user = new Users ({
  email: 'user@gmail.com',
  password: 'cool',
  apiKey: 'somelongassstring',
});

awesome_user.save((err) => {
  if(err) return handleError(err);
})

setup();

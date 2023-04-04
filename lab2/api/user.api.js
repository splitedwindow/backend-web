const { Router } = require("express");
const { Users } = require("../models/users");
const { v4:uuid } = require('uuid');

const router = Router();

router.post('/users', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  console.log('shit');
  
  if(!email || !password) 
  {
    return res.status(400).send({
      message: 'Email and password are required parameters'
    });
  }

  const isExists = await Users.findOne({email});
  if(isExists){

    return res.status(400).send({
      message: 'User with current email exists', isExists
    });
  }
  
  const apiKey = uuid();

  const user = new Users({
    apiKey, email, password
  });

  const doc = await user.save();
  
  return res.status(200).send(doc);
});

router.post('/users/login', async (req, res) => {
  const { email, password} = req.body;
  console.log(req.body)

  // check 

  const findUser = await Users.findOne({email, password});
  if(findUser){

    return res.status(200).send({
      findUser
    });
  } 
  
  return res.status(400).send({
    message: "Wrong email or password"
  })
  
});

module.exports = { router };
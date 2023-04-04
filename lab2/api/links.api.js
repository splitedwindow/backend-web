const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { Router } = require("express");
const { Links } = require("../models/links");
const { Users } = require('../models/users')

const SHORT_LINK_SIZE = 15;

const router = Router();

router.post("/links", async (req, res) => {
  const { originalLink } = req.body;
  const { authorization } = req.headers;
  
  
  let apiKey = authorization;

  // console.log('\ntry to find user', apiKey);
  const findUser = await Users.findOne({ apiKey });
  // console.log('\nuserObject: ', findUser);
  if (!findUser) {
    return res.status(401).send({
      message: "User is not authorized",
    });
  }
  
  
  console.log(`find user: ${findUser._id}`);


  let short_link = createShortLink();
  // console.log('\nshort_link: ', short_link);
  // check if exists

  let dbQuery = {};
  dbQuery.authorization = authorization;
  dbQuery["links.cut"] = 'https://google.com/' + short_link;
  // console.log('\ndbQuery: ', dbQuery)
  
  let isExists = await Links.findOne(dbQuery);

  let overload = 100;

  for (let i = 0; isExists ; i++) {
    short_link = createShortLink();

    // update search object values
    dbQuery['links.cut'] = 'https://google.com/' + short_link;
    
    // create new link
    isExists = await Links.findOne(dbQuery);

    // leave if can't create new link for 100 times;
    if (i === overload) {
      return res.status(500).send({
        message: "New link creation failure",
      });
    }
  }

  {
    let now = new Date();
    let expiredAt = new Date();
    expiredAt.setDate(now.getDate()+5);
  
    let cut = 'https://google.com/' + short_link;
    let userId = findUser._id;
    let original = originalLink;
  
    let save_link = {
      userId,
      links: {
        original,
        cut
      },
      expiredAt
    }
  
    // console.log("SAVE_LINK", save_link);
  
    const link = new Links(save_link);
  
    // console.log("LINK: ", link);
  
    const doc = await link.save();
  
    return res.status(200).send(doc);
  }

});


const characters =
  "abcdefghijklmnopqrstuvwxyz" +
  "abcdefghijklmnopqrstuvwxyz".toUpperCase() +
  "0123456789";

let count_of_characters = characters.length;

function createShortLink() {
  let randomNumber =
    Math.floor(Math.random() * (count_of_characters - 0 + 1)) + 0;

  let generate_short_link = "";
  for (let i = 0; i < SHORT_LINK_SIZE; i++) {
    generate_short_link = generate_short_link + characters[randomNumber];
    randomNumber = Math.floor(Math.random() * (count_of_characters - 0 + 1)) + 0; // 0 - is minimum
  }

  return generate_short_link;
}

router.get("/links", async (req, res) => {
  const { authorization } = req.headers;

  let {
    expiredAt,
  } = req.query;

  // { expiredAt: '{"gt": "2023-03-08T06:27:37.647 00:00" }' }
  let apiKey = authorization;

  const findUser = await Users.findOne({ apiKey });

  if (!findUser) {
    return res.status(401).send({
      message: "User is not authorized",
    });
  }

  let user_ID = findUser.userId


  if(!expiredAt) // return all links user has
  {
    let user_links = await Links.find({
      user_ID,
    })

    return res.status(200).send(user_links);
  } else
  {
    let jsonExpiredAt = JSON.parse(expiredAt);

    let booleanLt = Boolean(jsonExpiredAt.lt);
    let booleanGt = Boolean(jsonExpiredAt.gt);
        
    if(booleanLt && booleanGt){ // ls and gt
      
      let greaterThanDate = Date.parse(jsonExpiredAt.gt);
      let lessThanDate = Date.parse(jsonExpiredAt.lt);

      let expiredAtLinks = await Links.find({ 
        expiredAt: {
          $gt: greaterThanDate, 
          $lt: lessThanDate
        },
        user_ID

      });

      return res.status(200).send(expiredAtLinks);

    } else if (booleanGt && !booleanLt) // gt only
    {
      let greaterThanDate = Date.parse(jsonExpiredAt.gt);

      let expiredAtLinks = await Links.find({ 
        expiredAt: {
          $gt: greaterThanDate, 
        },
        user_ID
      });

      return res.status(200).send(expiredAtLinks);

    } else if (!booleanGt && booleanLt) // ls only
    {
      let lessThanDate = Date.parse(jsonExpiredAt.lt);

      let expiredAtLinks = await Links.find({ //query today up to tonight
        expiredAt: {
          $lt: lessThanDate
        },
        user_ID
      });

      return res.status(200).send(expiredAtLinks);
    } else if(!booleanGt && !! )
    {
      
    }
  }


  return res.status(400).send({ 
    message: 'bad parameters bro'
  })
  
});

router.get('/shortLink/:cut', async (req, res) => {

  const cutLink = req.params.cut;
  dbQuery = {};

  let today = new Date();

  if(cutLink) {
    dbQuery['links.cut'] = 'https://google.com/' + cutLink;
  }

  console.log(dbQuery);

  const doc = await Links.findOne(dbQuery);

  if(doc)
  {
    if(doc.expiredAt < today)
    {
      return res.status(400).send({
        message: 'Link is expired',
      })
    }

    return res.redirect(doc.links.original);
  } else 
  {
    return res.status(400).send({
      message: 'Link was not found',
    })
  }
  
});

module.exports = { router };
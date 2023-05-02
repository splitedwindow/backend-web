const { Router } = require("express");
const { Sales } = require("../models/sales");

const router = Router();

router.get("/sales", async (req,res) => {
  let {
    storeLocation,
    customer_age,
    customer_emailDomain,
    items_tags,
    couponUsed
  } = req.query;

  let dbQuery = {};


  // if storeLocation is given
  if(storeLocation) {
    if(storeLocation.includes("*"))
    {
      // if string has \* 
      if(storeLocation.includes("\\"))
      {
        const parts = storeLocation.split("\\*");

        // if not able to get the parts
        if(!parts) {
          return res.status(401).send({message: "Bad Location parameters!"});
        }

        let starts_with = parts[0];
        let ends_with = parts[1];
        
        dbQuery.storeLocation = {$regex: new RegExp(`^${starts_with}.*${ends_with}$`)}
      } 
      // first character is *
      else if(storeLocation[0] === "*")
      {
        // cut the first character '*' from the string for query
        let query_result = storeLocation.substring(1, storeLocation.length);

        dbQuery.storeLocation = {$regex: `${query_result}$`}
      }
      // last character is *
      else if(storeLocation[storeLocation.length -1] === "*")
      {
        // cut the last character '*' from the string for query
        let query_result = storeLocation.substring(0, storeLocation.length - 1);

        dbQuery.storeLocation = {$regex: `^${query_result}`}
      } else {
        res.status(403).send({message: "Bad location parameters"});
      }

    } 
    // search by "text"
    else {
      dbQuery.storeLocation = storeLocation;
    }

  }
  
  // if customer_age is given
  if(customer_age)
  {
    // create to object data
    customer_age = JSON.parse(customer_age);


    // lt and gt was given
    if(customer_age.lt && customer_age.gt)
    {
      if(parseInt(customer_age.gt) > parseInt(customer_age.lt))
      {
        return res.status(401).send({message: "lt is higher than gt", customer_age});
      }
      // if parameters are ok - query
      let less_than = parseInt(customer_age.lt);
      let greater_than = parseInt(customer_age.gt);

      dbQuery["customer.age"] = {
        $gt: greater_than,
        $lt: less_than
      }
    }
    // only gt was given
    else if(customer_age.gt)
    {
      let greater_than = parseInt(customer_age.gt);

      dbQuery["customer.age"] = {
        $gt: greater_than,
      }
    }
    // only lt was given
    else if(customer_age.lt)
    {
      let less_than = parseInt(customer_age.lt);

      dbQuery["customer.age"] = {
        $lt: less_than
      }
    }
  }

  // if customer_emailDomain is given
  if(customer_emailDomain)
  {
    dbQuery["customer.email"] = {$regex: `${customer_emailDomain}$`}
    
    //  dbQuery.storeLocation = {$regex: `${query_result}$`}
  }

  // if items_tags is given
  if(items_tags)
  {
    items_tags = items_tags.split(",")

    console.log(items_tags);
    if (!items_tags)
    {
      res.status(401).send({message: "Bad tags parameters"});
    }

    dbQuery.items = {$elemMatch : { tags: {$in: items_tags}}};
  }


  // if couponUsed is given
  if(couponUsed)
  {
    if(couponUsed === "false")
    {
      dbQuery.couponUsed = false;
    } else if(couponUsed === "true")
    {
      dbQuery.couponUsed = true;
    } else 
    {
      return res.status(401).send({message: "bad coupon parameter"});
    }
  }
  
  console.log(dbQuery)

  
  const docs = await Sales.find(dbQuery).limit(10);
  return res.status(200).send(docs);

})

module.exports = { router };
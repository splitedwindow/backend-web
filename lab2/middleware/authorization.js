const authorization = (req, res, next) => {
 const { authorization } = req.headers;
 console.debug(`[middleware][authorization] token:${authorization}`);
 if (authorization != process.env.TOKEN) {
  return res.status(401).send({
   message: `This request not include header authorization with correct api key`
  });
 }

 return next();
};

module.exports = { authorization };
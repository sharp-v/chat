const cors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", false);
  res.header("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token"
  );
  next();
};

module.exports = cors;

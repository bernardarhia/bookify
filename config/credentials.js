const allowedOrigins = require("./allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", origin);
  }
  next();
};

module.exports = credentials;

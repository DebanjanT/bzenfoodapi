import BzUser from "../models/user";
const jwt = require("jsonwebtoken");

//verify jwt token
export const verifyJwtToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Empty authorization header" });
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send({ message: "Null token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = data; //this will give req.user access
    next();
  });
};

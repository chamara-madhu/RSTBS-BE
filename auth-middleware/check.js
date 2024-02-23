const jwt = require("jsonwebtoken");
const { secretOfKey, USER_ROLES } = require("../config/constant");

exports.isAuth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];

    jwt.verify(token, secretOfKey, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else res.status(401).json({ error: "User access denied" });
    });
  } else {
    res.status(401).json({ error: "User access denied" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role == USER_ROLES.ADMIN) {
    next();
  } else res.status(401).json({ error: "User access denied" });
};

exports.isPassenger = (req, res, next) => {
  if (req.user.role == USER_ROLES.PASSENGER) {
    next();
  } else res.status(401).json({ error: "User access denied" });
};

exports.isChecker = (req, res, next) => {
  if (req.user.role == USER_ROLES.CHECKER) {
    next();
  } else res.status(401).json({ error: "User access denied" });
};

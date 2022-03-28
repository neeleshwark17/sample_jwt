require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const requireAuth = function (req, res, next) {
  const token = req.cookies.jwtLogin;

  //check token exist in cookie
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("Token not match---" + err);
        res.redirect("/login");
      } else {
        console.log("DECODED TOKEN =" + decodedToken, decodedToken.id);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//check current user
const checkUser = function (req, res, next) {
  console.log("CHECK USER");
  const token = req.cookies.jwtLogin;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log("Invalid token" + err);
        res.locals.user = null;
        next();
      } else {
        console.log("decoded token-" + decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };

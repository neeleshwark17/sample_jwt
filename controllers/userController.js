const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

require("dotenv").config();
//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  if (err.message === "Invalid email") {
    errors.email = "Email is not registered";
  }
  if (err.message === "Invalid password") {
    errors.email = "Incorrect password";
  }
  //duplicate eamil error
  if (err.code === 11000) {
    errors.email = "User already registered";
    return errors;
  }

  //validate
  if (err.message.includes("user validation failed")) {
    console.log(
      Object.values(err.errors).forEach(({ properties }) => {
        console.log(properties);
        errors[properties.path] = properties.message;
      })
    );
  }

  return errors;
};

const maxAge = 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
module.exports.signUpGet = (req, res) => {
  console.log(`ENV------${process.env.JWT_SECRET}`);
  res.render("signUp");
};
module.exports.loginGet = (req, res) => {
  res.render("login");
};

module.exports.productGet = (req, res) => {
  res.render("product");
};

module.exports.aboutGet = (req, res) => {
  res.render("about");
};

//POST ROUTES
module.exports.signUpost = async (req, res) => {
  const { userName, email, password } = req.body;
  console.log("DETAILSSS-----" + userName, email, password);

  try {
    const user = await User.create({ userName, email, password });
    const token = createToken(user._id);
    console.log(user._id);
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
    });
    res.status(201).json({ user: user._id });
  } catch (e) {
    const errors = handleErrors(e);
    res.status(400).json(errors);
  }
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  console.log("Email and password", email, password);

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);
    res.cookie("jwtLogin", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ user: user._id });
  } catch (err) {
    let errors = handleErrors(err);
    console.log("handle errors" + errors);
    res.status(404).json({ errors });
  }
};

module.exports.logOutGet = (req, res) => {
  res.cookie("jwtLogin", "", { maxAge: 1 });
  res.redirect("/");
};

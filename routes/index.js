require("dotenv").config;
var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const userController = require("../controllers/userController");
const { requireAuth, checkUser } = require("../middleware/middleware");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

mongoose.connect(
  "mongodb+srv://neeleshwar7:neeleshwar7@dev.fmqcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);
const db = mongoose.connection;

db.on("err", console.log.bind(console, "Connection Error"));
db.once("open", function () {
  console.log("Connection Succeed");
});

router.get("*", checkUser);

router.get("/signUp", userController.signUpGet);
router.post("/signUp", userController.signUpost);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/about", requireAuth, userController.aboutGet);
router.get("/product", userController.productGet);
router.get("/logout", userController.logOutGet);

module.exports = router;

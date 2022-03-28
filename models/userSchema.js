const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Enter Name"],
  },
  email: {
    type: String,
    required: [true, "Enter email!"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Enter Password!"],
    minlength: [6, "Min length 6 characters"],
  },
});

userSchema.pre("save", async function (next) {
  const saltRounds = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

//Static method for login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }, (err, results) => {
    if (err) console.log("RES--ERRORS", err);
    console.log("RES--", results);
  });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("Invalid password");
    }
  } else {
    throw Error("Invalid email");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 402;
    error.data = errors.array();
    throw error;
  }
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({ name, email, password: hashPassword });
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: "ok" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 402;
    error.data = errors.array();
    throw error;
  }
  
  const { email, password } = req.body;
  var loadedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found!");
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "thiIsTestJsonToken",
        { expiresIn: "1h" },
      );
      res.status(200).json({ token: token, userEmail: loadedUser.email });
    })
    .catch((err) => {
      // console.log(err.data)
      next(err);
    });
};

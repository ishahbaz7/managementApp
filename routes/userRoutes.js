const express = require("express");
const User = require("../models/userModel");
const { body } = require("express-validator");

const router = express.Router();
const userController = require("../controllers/userController");

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value) => {
        return User.findOne({ email: value }).then((userDocks) => {
          if (userDocks) {
            return Promise.reject("Email address already exist!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please enter password at least 5 character long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password does not match");
      }
      return true;
    }),
    body("name").trim().not().isEmpty().withMessage("Enter your name!"),
  ],
  userController.postRegister
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter your password!"),
  ],
  userController.postLogin
);

module.exports = router;

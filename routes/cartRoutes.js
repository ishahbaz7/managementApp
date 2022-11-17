const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const cartController = require("../controllers/cartController");

router.get("/cart", isAuth, cartController.getCartItems);
router.post("/cart/:productId", isAuth, cartController.addToCart);

module.exports = router;

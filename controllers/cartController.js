const Cart = require("../models/cartModel");

exports.addToCart = ({ userId }, req, res, next) => {
  const { productId } = req.params;
  Cart.findOne({ userId, productId }).then((cartItem) => {
    console.log(cartItem);
    if (cartItem) {
      cartItem.quantity++;
      return cartItem.save();
    }
    const cart = new Cart({ userId, productId, quantity: 1 });
    cart.save();
  }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "success" });
  })
  .catch((err) => {
    console.log(err);
    next(err);
  });
};

exports.getCartItems = ({userId}, req, res, next) => {
    Cart.find({userId}).populate('productId').select('productId, quantity').
    then(products => {
        console.log(products)
        res.status(200).json(products);
    }).catch(err => {
        next(err);
    })
}

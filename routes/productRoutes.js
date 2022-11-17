const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator");

router.post(
  "/product",
  [
    body("productTitle")
      .not()
      .isEmpty()
      .withMessage("Please Enter Product title"),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Please Enter Product description"),
    body("price").not().isEmpty().withMessage("Please Enter Product price"),
  ], isAuth,
  productController.addProduct
);
router.get("/productsHome", productController.getProductsHome);
router.get("/products/:currentPage/:perPage", isAuth, productController.getProducts);
router.delete("/product/:id", isAuth, productController.deleteProduct);
router.get("/product/:id", isAuth, productController.getProduct);
router.put(
  "/product",
  isAuth,
  [
    body("productTitle")
      .not()
      .isEmpty()
      .withMessage("Please Enter Product title"),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Please Enter Product description"),
    body("price").not().isEmpty().withMessage("Please Enter Product price"),
  ],
  productController.updateProduct
);

module.exports = router;

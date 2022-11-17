const Product = require("../models/productModel");
const Cart = require('../models/cartModel')
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken')
const { validationResult } = require("express-validator");

exports.addProduct = ({userId}, req, res, next) => {
  const errors = validationResult(req);
  const { productTitle, description, price } = req.body;
  const productImageUrl = req.file;
  if (!errors.isEmpty() || !productImageUrl) {
    const error = new Error("Validation failed!");
    error.statusCode = 402;
    error.data = errors.array();
    error.data.push({
      msg: "Please select product image!",
      param: "productImageUrl",
    });
    throw error;
  }
  const product = new Product({
    productTitle,
    description,
    price,
    productImageUrl: productImageUrl.path,
    userId
  });
  product
    .save()
    .then((result) => {
      res.status(201).json(result);
      console.log(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProductsHome = (req, res, nex) => {
  var token = req.get("Authorization").split(" ")[1];
  console.log(token)
  var decodeToken;
  try {
    decodeToken = jwt.verify(token, "thiIsTestJsonToken")
    console.log('decodeToken', decodeToken)
  } catch (error) {
      console.log(error);
  }
  Product.find().sort({updatedAt: -1}).then(products => {

    res.status(200).json({ products });
  }).catch(err => {
    console.log(err)
  })
}

exports.getProducts = ({userId}, req, res, next) => {
  const {currentPage, perPage} = req.params
  var totalItems;
  Product.find()
    .sort({ updatedAt: -1 })
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Product.find({userId})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((products) => {
      res.status(200).json({ products, totalItems });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = ({userId}, req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => {
      if(product.userId.toString() !== userId.toString()){
        console.log('userId',product.userId)
        const error = new Error('User is not Authenticated to delete this product!')
        error.statusCode = 401
        throw error;
      }
      fs.unlink(path.join(__dirname, "../", product.productImageUrl), () => {
        return product.remove();
      });
    })
    .then((result) => {
      res.status(202).json(result);
    })
    .catch((err) => {
      console.log(err);
      next(err)
    });
};

exports.updateProduct = (req, res, next) => {
  var productImageUrl = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 402;
    error.data = errors.array();
    throw error;
  }
  Product.findById({userId},req.body._id)
    .then((product) => {
      if(product.userId.toString() !== userId.toString())
      console.log(product);
      product.productTitle = req.body.productTitle;
      product.description = req.body.description;
      product.price = req.body.price;
      if (productImageUrl) {
        fs.unlink(
          path.join(__dirname, "../", product.productImageUrl),
          () => {}
        );
        product.productImageUrl = productImageUrl.path;
      }
      return product.save();
    })
    .then((result) => {
      console.log(result);
      res.status(202).json({ message: "ok" });
    })
    .catch((err) => {
      console.log(err);
    });
};

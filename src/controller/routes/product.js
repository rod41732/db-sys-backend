const ProductRouter = require('express').Router();
const ProductRepository = require('../../repository/product.repo');

const idCheck = (req, res, next) => {
    const {id} = req.params;
    // id is not number, or is float
    if (isNaN(parseInt(id)) || parseInt(id) !== +id) {
      return res.status(400).send({
        message: "Bad ID in URL",
      })
    }
    next();
  }

// Get all products
ProductRouter.get('/', async (req, res) => {
    try {
        const products = await ProductRepository.getAllProducts();
        return res.status(200).send(products);
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

// Get product by id
ProductRouter.get('/:id', idCheck, async (req, res) => {
    const {id} = req.params;
    try {
        const product = await ProductRepository.getProduct(id);
        return res.status(200).send(product);
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

// New product
ProductRouter.post('/', async (req, res) => {
    const {productName, amountInStock, defaultPrice, type, image} = req.body;
    if (!productName) {
        return res.status(400).send({message: "Product name is not specified"});
    }
    try {
        const result = await ProductRepository.createProduct(productName, amountInStock, defaultPrice, type, image);
        return res.status(201).send({
            message: "OK",
            id: result.insertId,
        })
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

ProductRouter.delete('/:id', idCheck, async (req, res) => {
    const {id} = req.params;
    try {
        await ProductRepository.getProduct(id);
    }
    catch (err) {
        return res.status(400).send({message: "Product does not exist"});
    }

    try {
        const result = await ProductRepository.deleteProduct(id);
        return res.status(200).send({message: "OK"});
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

module.exports = ProductRouter
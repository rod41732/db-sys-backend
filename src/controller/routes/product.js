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

// RO
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
        const result = await ProductRepository.deleteProduct(id);
        console.log('delete result', result);
        if (!result.affectedRows) {
            return res.status(404).send({message: 'Product Not Found'})
        }
        return res.status(200).send({message: "OK"});
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

module.exports = ProductRouter
/*
  fieldCount: 0,
  affectedRows: 0,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
*/
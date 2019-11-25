const TransactionRouter = require('express').Router();
const TransactionRepository = require('../../repository/transaction.repo');

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

// Get all transactions
TransactionRouter.get('/', async (req, res) => {
    let transactions;
    try {
        if (Object.keys(req.query).length > 0) {
            transactions = await TransactionRepository.filterTransaction(req.query);
        }
        else {
            transactions = await TransactionRepository.getAllTransactions();
        }
        return res.status(200).send(transactions);
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

// Get transaction by ID
TransactionRouter.get('/:id', idCheck, async (req, res) => {
    const {id} = req.params;
    try {
        const transactions = await TransactionRepository.getTransaction(id);
        if (transactions.length === 0) {
            return res.status(404).send({message: "Transaction not found"});
        }
        return res.status(200).send(transactions[0]);
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

TransactionRouter.get('/:id/productline', idCheck, async (req, res) => {
    const {id} = req.params;
    try {
        return res.status(200).send(await TransactionRepository.getProductLineOfTransaction(id));
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})


TransactionRouter.post('/', async (req, res) => {
    const {transaction, productLines} = req.body;
    try {
        const result = await TransactionRepository.createTransaction(transaction, productLines);
        return res.status(201).send({
            message: "OK",
            id: result.insertId,
        })
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

TransactionRouter.put('/:id', idCheck, async (req, res) => {
    const {id} = req.params;
    const updateData = req.body;
    try {
        const result = await TransactionRepository.updateTransaction(id, updateData);
        return res.status(200).send({message: "OK"});
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

TransactionRouter.delete('/:id', idCheck, async (req, res) => {
    const {id} = req.params;
    try {
        const result = await TransactionRepository.deleteTransaction(id);
        return res.status(200).send({message: "OK"});
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

TransactionRouter.get('/product-line/:id', idCheck, async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).send({message: `Transaction ID not specified`});
    }
    try {
        const result = await TransactionRepository.getProductLineOfTransaction(id);
        return res.status(200).send(result);
    }
    catch (err) {
        return res.status(500).send({message: err.message});
    }
})

module.exports = TransactionRouter
require('dotenv').config();
console.log(require('./config'))
const connector = require('../src/connector/connector');
const txnRepo = require('../src/repository/transaction.repo');


txnRepo.createTransaction({
    TransDate: new Date(),
    BranchID: 1,
    CardID: null,
}, [
    {
        ProdID: 1,
        NumBuy: 1,
        Price: 50,
    }
]).then(console.log)
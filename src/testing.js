const connector = require('../src/connector/connector');

connector.queryPrep(`INSERT INTO Product (ProdName, ProdType) VALUES (?, ?)`, [
    ['Doge1', 'Beverage'],
    ['Doge2', 'Dessert']
]).then(res => {
    console.log(res)
})
const connector = require('../connector/connector');
const Product = require('../schema/product');

class ProductRepository{
    static async getAllProducts() {
        return await connector.query(`SELECT * FROM ${Product.TABLE_NAME}`);
    }

    static async getProduct(productID) {
        return await connector.queryPrep(`SELECT * FROM ${Product.TABLE_NAME}
        WHERE ProductID = ?`,
        [productID])
    }

    static async createProduct(productName, amountInStock, defaultPrice, type, image) {
        const result = await connector.queryPrep(`INSERT INTO ${Product.TABLE_NAME} (ProductName, AmountInStock, DefaultPrice, ProductType, Image)
        VALUES (?, ?, ?, ?, ?)`,
        [productName, amountInStock, defaultPrice, type, image]);
        await connector.commit();
        return result;
    }

    static async deleteProduct(productID) {
        const result = await connector.queryPrep(`DELETE FROM ${Product.TABLE_NAME} WHERE ProductId = ?`,
        [productID]);
        await connector.commit();
        return result;
    }
}

module.exports = ProductRepository
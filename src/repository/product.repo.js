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
        const result = await connector.queryPrep(`INSERT INTO ${Product.TABLE_NAME} (ProdName, AmountInStock, DefaultPrice, ProdType, Image)
        VALUES (?, ?, ?, ?, ?)`,
        [productName, amountInStock, defaultPrice, type, image]);
        await connector.commit();
        return result;
    }

    static async updateProduct(prodID, updateData) {
        console.log(updateData);
        console.log(Object.values(updateData));
        const result = await connector.queryPrep(`UPDATE ${Product.TABLE_NAME}
        SET ${Object.keys(updateData).map(x => `${x} = ?`).join(", ")}
        WHERE ProdID = ?`,
        [...Object.values(updateData), prodID]);
        console.log(`================================`);
        //console.log(result);
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
const connector = require('../connector/connector');
const Product = require('../schema/product');

class ProductRepository{
    static async getAllProducts() {
        return await connector.query(`SELECT * FROM ${Product.TABLE_NAME}`);
    }

    static async getProduct(ProdID) {
        return await connector.queryPrep(`SELECT * FROM ${Product.TABLE_NAME}
        WHERE ProdID = ?`,
        [ProdID])
    }

    static async productFilter(filterParams) {
        return await connector.queryPrep(`SELECT * FROM ${Product.TABLE_NAME}
        WHERE ${Object.keys(filterParams).map(x => `${x} LIKE ?`).join(", ")}`,
        Object.values(filterParams).map(element => `%${element}%`));
    }

    static async createProduct(ProdName, AmountInStock, DefaultPrice, ProdType, Image) {
        const result = await connector.queryPrep(`INSERT INTO ${Product.TABLE_NAME} (ProdName, AmountInStock, DefaultPrice, ProdType, Image)
        VALUES (?, ?, ?, ?, ?)`,
        [ProdName, AmountInStock, DefaultPrice, ProdType, Image]);
        await connector.commit();
        return result;
    }

    static async updateProduct(ProdID, updateData) {
        const result = await connector.queryPrep(`UPDATE ${Product.TABLE_NAME}
        SET ${Object.keys(updateData).map(x => `${x} = ?`).join(", ")}
        WHERE ProdID = ?`,
        [...Object.values(updateData), ProdID]);
        await connector.commit();
        return result;
    }

    static async deleteProduct(ProdID) {
        const result = await connector.queryPrep(`DELETE FROM ${Product.TABLE_NAME} WHERE ProdId = ?`,
        [ProdID]);
        await connector.commit();
        return result;
    }
}

module.exports = ProductRepository
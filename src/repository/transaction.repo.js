const connector = require('../connector/connector');
const Transaction = require('../schema/transaction');
const ProductLine = require('../schema/product-line');

class TransactionRepository{
    static async getAllTransactions() {
        return await connector.query(`SELECT * FROM ${Transaction.TABLE_NAME}`);
    }

    static async getTransaction(transactionID) {
        return await connector.queryPrep(`SELECT * FROM ${Transaction.TABLE_NAME}
        WHERE TransID = ?`,
        [transactionID])
    }

    static async getFilterQuery(filterParams) {
        const returnVal = [filterParams.BranchID ? `BRANCH ID = ${filterParams.BranchID}` : null,
                            filterParams.FromDate ? `TransDate >= ${filterParams.FromDate}` : null,
                            filterParams.ToDate ? `TransDate <= ${filterParams.ToDate}` : null];
        return returnVal.filter((value) => value).join(" AND ");
    }

    static async filterTransaction(filterParams) {
        const filterQuery = await this.getFilterQuery(filterParams);
        return await connector.query(`SELECT * FROM ${Transaction.TABLE_NAME}
        WHERE ${filterQuery}`);
    }

    static async createTransaction(transaction, productLines) {
        const result = await connector.queryPrep(`INSERT INTO ${Transaction.TABLE_NAME} (TransDate, Amount, BranchID, CardID)
        VALUES (?, 0, ?, ?)`,
        [transaction.TransDate, transaction.BranchID, transaction.CardID]);
        await connector.commit();
        const TransID = result.insertId;
        for (let d of productLines) {
            const {ProductID, NumBuy, Price} = d;
            connector.queryPrep(`INSERT INTO ${ProductLine.TABLE_NAME}
             (ProductID, TransID, NumBuy, Price)
              VALUES (?, ?, ?, ?)`,
              [ProductID, TransID, NumBuy, Price]
            );
        }
        await connector.commit();   
        return result;
    }

    static async updateTransaction(prodID, updateData) {
        const result = await connector.queryPrep(`UPDATE ${Transaction.TABLE_NAME}
        SET ${Object.keys(updateData).map(x => `${x} = ?`).join(", ")}
        WHERE TransID = ?`,
        [...Object.values(updateData), prodID]);
        await connector.commit();
        return result;
    }

    static async deleteTransaction(transactionID) {
        const result = await connector.queryPrep(`DELETE FROM ${Transaction.TABLE_NAME} WHERE ProdID = ?`,
        [transactionID]);
        await connector.commit();
        return result;
    }
}

module.exports = TransactionRepository
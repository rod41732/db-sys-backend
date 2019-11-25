const connector = require('../connector/connector');
const Branch = require('../schema/branch');
const PromotionInBranch = require('../schema/promotion-in-branch');
const ProductLine = require('../schema/product-line');
const Transaction = require('../schema/transaction');


class BranchRepository {

  static async getAllBranches() {
    return await connector.query(`SELECT * FROM ${Branch.TABLE_NAME}`);
  }

  static async queryBranch(query) {
    const pattern = '%' + query + '%';
    console.log('Query Branch pattern = ', pattern);
    const result = await connector.queryPrep(`
      SELECT * FROM ${Branch.TABLE_NAME} WHERE Location LIKE ?
      UNION
      SELECT * FROM ${Branch.TABLE_NAME} WHERE BranchName LIKE ?
    `, [pattern, pattern]);
    return result;
  }

  static async createBranch(BranchName, Location, PhoneNo) {
    const result = await connector.queryPrep(`
      INSERT INTO ${Branch.TABLE_NAME} (BranchName, Location, PhoneNo)
      VALUES 
      (?, ?, ?); 
    `, [BranchName, Location, PhoneNo])
    await connector.commit();
    return result;
  }

  static async deleteBranch(BranchID) {
    const result = await connector.queryPrep(`
      DELETE FROM ${Branch.TABLE_NAME} WHERE
      BranchID = ?
    `, [BranchID]);
    await connector.commit();
    return result;
  } 

  static async updateBranch(BranchID, BranchName, Location, PhoneNo) {
    const result = await connector.queryPrep(`
      UPDATE ${Branch.TABLE_NAME} 
      SET
      BranchName = ?, Location = ?, PhoneNo = ?
      WHERE
      BranchID = ?
    `, [BranchName, Location, PhoneNo, BranchID]);
    await connector.commit();
    return result;
  }

  static async getBranchByID(BranchID) {
    const result = await connector.queryPrep(`
      SELECT * FROM ${Branch.TABLE_NAME} WHERE 
      BranchID = ?
    `, [BranchID]);
    return result; 
  }

  // --------------- 
  static async getBranchRunningPromotion(promotionID) {
    const result = await connector.queryPrep(`SELECT * FROM ${Branch.TABLE_NAME} 
    INNER JOIN ${PromotionInBranch.TABLE_NAME}
    ON PromotionID = ?`, [promotionID]);
    return result;
  }

  static async getProductLineFromBranchID(BranchID) {
    return await connector.queryPrep(`SELECT * FROM ${ProductLine.TABLE_NAME}
    INNER JOIN ${Transaction.TABLE_NAME}
    ON (${ProductLine.TABLE_NAME}.TransID = ${Transaction.TABLE_NAME}.TransID AND ${Transaction.TABLE_NAME}.BranchID = ?)`,
    [BranchID]);
  }
}

module.exports = BranchRepository;
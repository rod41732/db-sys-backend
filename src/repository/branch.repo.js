const connector = require('../connector/connector');
const Branch = require('../schema/branch');
const PromotionInBranch = require('../schema/promotion-in-branch');


class BranchRepository {
  static async getBranchRunningPromotion(promotionID) {
    const {results, fields} = await connector.queryPrep(`SELECT * FROM ${Branch.TABLE_NAME} 
    JOIN ${PromotionInBranch.TABLE_NAME}
    ON PromotionID = ?`, [promotionID]);
    return results;
  }

  static async createBranch(BranchID, BranchName, Location, PhoneNo) {
    const result = await connector.queryPrep(`
      INSERT INTO ${Branch.TABLE_NAME} (BranchID, BranchName, Location, PhoneNo)
      VALUES 
      (?, ?, ?, ?); 
    `, [BranchID, BranchName, Location, PhoneNo])
    await connector.commit();
    return result;
  }

  static async getAllBranches() {
    const {results, fields} = await connector.query(`SELECT * FROM ${Branch.TABLE_NAME}`);
    return results;
  }
}

module.exports = BranchRepository;
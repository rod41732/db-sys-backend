const connector = require('../connector/connector');
const Promotion = require('../schema/promotion');
const PromotionInBranch = require('../schema/promotion-in-branch');
class PromotionRepository {
  static async getPromotionByBranch(branchID) {
    const {results, fields} =await connector.queryPrep(`SELECT * FROM ${Promotion.TABLE_NAME} 
    JOIN ${PromotionInBranch.TABLE_NAME}
    ON BranchID = ?`, [branchID]);
    return results;
  }
  
}

module.exports = PromotionRepository;
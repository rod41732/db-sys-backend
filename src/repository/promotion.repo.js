const connector = require('../connector/connector');
const Promotion = require('../schema/promotion');
const PromotionInBranch = require('../schema/promotion-in-branch');
class PromotionRepository {
  static async getPromotionByBranch(branchID) {
    const result = await connector.queryPrep(`SELECT * FROM ${Promotion.TABLE_NAME} 
    JOIN ${PromotionInBranch.TABLE_NAME}
    ON BranchID = ?`, [branchID]);
    return result;
  }

  static async getAllPromotions() {
    const result = await connector.query(`SELECT * FROM ${Promotion.TABLE_NAME} `);
    return result;
  }
  static async createPromotion(PType, PStartDate, PEndDate, PDetail) {
    const result = await connector.queryPrep(`
      INSERT INTO ${Promotion.TABLE_NAME} (PType, PStartDate, PEndDate, PDetail)
      VALUES 
      (?, ?, ?, ?); 
    `, [PType, PStartDate, PEndDate, PDetail])
    await connector.commit();
    return result;
  }
 
  static async assignPromotionToBranch(PromotionID, BranchID) {
    const result = await connector.queryPrep(`
      INSERT INTO ${PromotionInBranch.TABLE_NAME} (PromotionID, BranchID)
      VALUES 
      (?, ?); 
    `, [PromotionID, BranchID])
    await connector.commit();
    return result;
  }
}

module.exports = PromotionRepository;
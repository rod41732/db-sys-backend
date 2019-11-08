class Promotions {
  constructor(PromotionID,
    BranchID
  ) {
    this.PromotionID = PromotionID;
    this.BranchID = BranchID;
  }
}

Promotions.TABLE_NAME = 'PromotionInBranch';
module.exports = Promotions;
class Promotions {
  constructor(PromotionID,
    PType,
    PStartDate,
    PEndDate,
    PDetail
  ) {
    this.PromotionID = PromotionID;
    this.PType = PType;
    this.PStartDate = PStartDate;
    this.PEndDate = PEndDate;
    this.PDetail = PDetail;
  }
}

Promotions.TABLE_NAME = 'Promotions';
module.exports = Promotions;
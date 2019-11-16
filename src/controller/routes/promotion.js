const PromotionRouter = require('express').Router();
const BranchRepository = require('../../repository/branch.repo');
const PromotionRepository = require('../../repository/promotion.repo');
PromotionRouter.get('/:id/branches', async (req, res) => {
  const {id} = req.params;
  const result = await BranchRepository.getBranchRunningPromotion(id);
  return res.send(result);
})

PromotionRouter.get('/', async (req, res) => {
  const results = await PromotionRepository.getAllPromotions();
  return res.send(results);
})


// create
PromotionRouter.post('/', async (req, res) => {
  const {PType, PStartDate, PEndDate, PDetail} = req.body;
  if (!PType || !PStartDate || !PEndDate || !PDetail) {
    return res.status(400).send({
      message: "Please specify PType, PStartDate, PEndDate AND PDetail",
    });
  }
  try {
    const result = await PromotionRepository.createPromotion(PType, PStartDate, PEndDate, PDetail);
    return res.status(200).send({
      message: 'OK',
      id: result.insertId,
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
})

module.exports = PromotionRouter;
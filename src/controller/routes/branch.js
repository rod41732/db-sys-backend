const BranchRouter = require('express').Router();
const BranchRepository = require('../../repository/branch.repo');
const PromotionRepository = require('../../repository/promotion.repo');

BranchRouter.get('/:id/promotions', async (req, res) => {
  const {id} = req.params;
  const result = await PromotionRepository.getPromotionByBranch(id);
  return res.send(result);
})

// create
BranchRouter.post('/', async (req, res) => {
  const {BranchID, BranchName, Location, PhoneNo} = req.body;
  if (!BranchID || !BranchName || !Location || !PhoneNo) {
    return res.status(400).send({
      message: "Please specify BranchID, BranchName, Location AND PhoneNo",
    });
  }
  try {
    await BranchRepository.createBranch(BranchID, BranchName, Location, PhoneNo);
    return res.status(200).send({})
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
})

BranchRouter.get('/', async (req, res) => {
  const branches = await BranchRepository.getAllBranches();
  try {
    return res.status(200).send(branches)
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
})

module.exports = BranchRouter;
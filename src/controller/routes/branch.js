const BranchRouter = require('express').Router();
const BranchRepository = require('../../repository/branch.repo');
const PromotionRepository = require('../../repository/promotion.repo');

const idCheck = (req, res, next) => {
  const {id} = req.params;
  // id is not number, or is float
  if (isNaN(parseInt(id)) || parseInt(id) !== +id) {
    return res.status(400).send({
      message: "Bad ID in URL",
    })
  }
  next();
}

// list branch
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

// get branch, promotion
BranchRouter.get('/:id/promotions', idCheck, async (req, res) => {
  const {id} = req.params;
  const result = await PromotionRepository.getPromotionByBranch(id);
  return res.send(result);
})

// add promotion to branch
BranchRouter.post('/:id/promotions', idCheck, async (req, res) => {
  const {id} = req.params;
  const {PromotionID} = req.body;
  try {
    const result = await PromotionRepository.assignPromotionToBranch(PromotionID, id);
    return res.status(200).send({
      message: 'OK',
      id: result.insertId,
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    })
  }
})

// get branch, info
BranchRouter.get('/:id', idCheck, async (req, res) => {
  const {id} = req.params;
  const result = await BranchRepository.getBranchByID(id);
  return res.send(result);
})

BranchRouter.post('/search', async (req, res) => {
  const {term} = req.body;
  if (!term) {
    return res.status(400).send({
      message: "`term` is required"
    })
  }
  const result = await BranchRepository.queryBranch(term);
  return res.send(result);
})

// create
BranchRouter.post('/', async (req, res) => {
  const {BranchName, Location, PhoneNo} = req.body;
  if (!BranchName || !Location || !PhoneNo) {
    return res.status(400).send({
      message: "Please specify BranchName, Location AND PhoneNo",
    });
  }
  try {
    const result = await BranchRepository.createBranch(BranchName, Location, PhoneNo);
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

BranchRouter.delete('/:id', idCheck, async (req, res) => {
  const {id} = req.params;
  try {
    const { affectedRows } = await BranchRepository.deleteBranch(id);
    if (!affectedRows) {
      return res.status(404).send({
        message: `Branch ${id} doesn't exist`,
      })
    }
    return res.status(200).send({
      message: `Deleted Branch ${id}`,
    });
  } catch (err) {
    return res.send({
      message: err.message,
    })
  } 
}) 

// edit branch
BranchRouter.post('/:id', idCheck, async (req, res) => {
  const {id} = req.params;
  const {BranchName, Location, PhoneNo} = req.body;
  if (!BranchName || !Location || !PhoneNo) {
    return res.status(400).send({
      message: "Please specify BranchName, Location AND PhoneNo",
    })
  }
  const result = await BranchRepository.updateBranch(id, BranchName, Location, PhoneNo);
  return res.status(200).send(result);
})

BranchRouter.get('/product-line/:id', idCheck, async (req, res) => {
  const {id} = req.params;
  if (!id) {
    return res.status(400).send({message: `BranchID not specified`});
  }
  try {
    result = await BranchRepository.getProductLineFromBranchID(id);
    return res.status(200).send(result);
  }
  catch (err) {
    return res.status(500).send({message: err.message});
  }
})



module.exports = BranchRouter;
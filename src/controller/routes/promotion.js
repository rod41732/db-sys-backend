const PromotionRouter = require('express').Router();
const BranchRepository = require('../../repository/branch.repo');
PromotionRouter.get('/:id/branches', async (req, res) => {
  const {id} = req.params;
  const result = await BranchRepository.getBranchRunningPromotion(id);
  return res.send(result);
})

// create
PromotionRouter.post('/', async (req, res) => {
  const {username, password, role} = req.body;
  if (!username || !password || !role) {
    return res.status(400).send({
      message: "Please specify username, password AND role",
    });
  }
  try {
    await UserRepository.createUser(username, password, role);
    return res.status(200).send({})
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
})

module.exports = PromotionRouter;
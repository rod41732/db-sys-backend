const UserRouter = require('express').Router();
const UserRepository = require('../../repository/user.repo');

UserRouter.post('/login', async (req, res) => {
  const {username, password} = req.body;
  console.log(username);
  const {results} = await UserRepository.getUserByName(username);
  if (!results[0]) {
    return res.status(404).send({
      message: "Not found",
    });
  } 
  return res.send({
    user: results[0]
  })
})

// create
UserRouter.post('/', async (req, res) => {
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

module.exports = UserRouter
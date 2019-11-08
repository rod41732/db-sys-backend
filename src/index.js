const express = require('express')
const bodyParser = require('body-parser')
const connector = require('./connector/connector');
const UserRouter = require('./controller/routes/user'); 
const PromotionRouter = require('./controller/routes/promotion'); 
const BranchRouter = require('./controller/routes/branch'); 
const cors = require('cors');

connector.creatTables(); // prepare
// connector.dropTables()
const app = express();
app.use(cors())
app.use(bodyParser({extended: true}));



app.get('/', async (req, res) => {
  console.log("got ")
  const {results, fields } = await connector.query('SELECT 1 + 1 AS solution');
  res.send({
    results,
    fields,
  })
})

app.use('/user', UserRouter)
app.use('/promotion', PromotionRouter)
app.use('/branch', BranchRouter)


app.listen(3000, () => console.log('Server stared at port 3000'));
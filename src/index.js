const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const connector = require('./connector/connector');
const UserRouter = require('./controller/routes/user'); 
const PromotionRouter = require('./controller/routes/promotion'); 
const BranchRouter = require('./controller/routes/branch');
const ProductRouter = require('./controller/routes/product'); 
const TransactionRouter = require('./controller/routes/transaction');
const cors = require('cors');
const methodOverride = require('method-override');

connector.createTables(); // prepare
// connector.dropTables()
const app = express();

var corsOptions = {
  origin: 'http://localhost:4200', // angular
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(bodyParser({extended: true}));



app.get('/', async (req, res) => {
  console.log("got ")
  const result = await connector.query('SELECT 1 + 1 AS solution');
  res.send(result)
})

app.use('/user', UserRouter)
app.use('/promotion', PromotionRouter)
app.use('/branch', BranchRouter)
app.use('/product', ProductRouter)
app.use('/transaction', TransactionRouter)


app.use(methodOverride());
app.use((err, req, res, next) => {
  return res.status(500).send({
    message: err.message
  })
})

app.listen(3000, () => console.log('Server stared at port 3000'));
const express = require('express')
const bodyParser = require('body-parser')
const connector = require('./connector/connector');
const UserRouter = require('./controller/routes/user'); 

connector.creatTables(); // prepare
const app = express();
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


app.listen(3000, () => console.log('Server stared at port 3000'));
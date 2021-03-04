const db = require('./ConfigDatabase/db');
const products = require('./Routes/api/product')
const user = require('./Routes/api/user')
const cors = require('cors');
require('dotenv').config()

// Connect database mongoo
db.connect();


const express = require('express');
const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
const port = 5000;
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//Route
app.use('/api',products);
app.use('/api',user);
app.listen(port,()=>{
})


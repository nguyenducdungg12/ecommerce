const db = require('./ConfigDatabase/db');
const products = require('./Routes/api/product')
const user = require('./Routes/api/user')
const cors = require('cors');
const path = require('path');
require('dotenv').config()

// Connect database mongoo
db.connect();

const express = require('express');
const app = express();
//use file static
app.use(express.static('Image'))
console.log(path.join(__dirname,'Image'))
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


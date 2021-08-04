const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require("dotenv").config();

let mysql = require('mysql2/promise');
/* const pool = mysql.createPool({
	host: process.env.DB_HOST,		//db접속주소
    port: process.env.DB_PORT,					//db접속포트
    user: process.env.DB_USER,					//db접속id
    password: process.env.DB_PASSWORD,		//db접속pw
    database: process.env.DB_DATABASE	
}); */

let _url = null;
const app = express()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', async (req, res) => {

    res.sendFile(__dirname + '/html/exception.html');
    
   
})
app.listen(3000, () => console.log('Example app listening on port 3000!'))

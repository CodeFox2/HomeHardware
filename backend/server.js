import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(cors());

//Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'atthelastsecond',
    database: 'hardware'
});
// "atthelastsecond" can be replaced with whatever password your database uses

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '[password]';
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});
app.get("/", (req, res) => {
    res.json("hello");
});

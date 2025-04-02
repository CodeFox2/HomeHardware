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

//Post Method: Insert Data
app.post('/add', (req, res) => {
    const {name, job, experience, salary} = req.body;
    const query = 'INSERT INTO employees (name, job, experience, salary) VALUES (?, ?, ?, ?)';
    db.query(query, [name, job, experience, salary], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Employee added successfully');
    });
});
//Get Method: Read Data
app.get('/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
//Put Method: Update Data
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, job, experience, salary } = req.body;
    const query = 'UPDATE employees SET name = ?, job = ?, experience = ?, salary = ? WHERE id = ?';
    db.query(query, [name, job, experience, salary, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Employee updated successfully');
    });
});
//Delete Method: Delete Data
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM employees WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Employee deleted successfully');
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost: ${PORT}`));

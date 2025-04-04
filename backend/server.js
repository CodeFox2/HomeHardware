import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost: ${PORT}`));

//Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'atthelastsecond',
    database: 'hardware'
});

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'atthelastsecond';
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
});
app.get("/", (req, res) => {
    res.json("Welcome.");
});

//Post Method: Insert Data
app.post('/add', async (req, res) => {
    const {name, email, password} = req.body;
    console.log(req.body);
    const query = 'INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Account added successfully');
    });
});
//Get Method: Read Data
app.get('/accounts', (req, res) => {
    const query = 'SELECT * FROM accounts';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
//Put Method: Update Data
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, points } = req.body;
    const query = 'UPDATE accounts SET name = ?, email = ?, password = ?, points = ? WHERE account_id = ?';
    db.query(query, [name, email, password, points, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Item updated successfully');
    });
});
//Delete Method: Delete Data
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM account WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Item deleted successfully');
    });
});

//---------------------------------------------------------------------------------------------

app.post('/login', (req, res) => {
	const {email, password} = req.params;
	if (email && password) {
		db.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password], (err, result) => {
			if (err) return res.status(500).send(err);
			if (result.email != "" || result.password != "") {
				res.json(results);
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
		});
	} else {
		res.send('Please enter Username and Password!');
	}
});

app.get('/customer', (req, res) => {
    const query = 'SELECT id, points FROM login';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

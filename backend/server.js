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
    console.log('Connected to MySQL Database');
});
app.get("/", (req, res) => {
    res.json("Welcome.");
});

//Post Method: Insert Data
app.post('/add', (req, res) => {
    const {item_name, item_price, item_quantity} = req.body;
    const query = 'INSERT INTO cart (item_name, item_price, item_quantity) VALUES (?, ?, ?)';
    db.query(query, [item_name, item_price, item_quantity], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Item added successfully');
    });
});
//Get Method: Read Data
app.get('/cart', (req, res) => {
    const query = 'SELECT * FROM cart';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
//Put Method: Update Data
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { item_quantity } = req.body;
    const query = 'UPDATE cart SET item_quantity = ? WHERE id = ?';
    db.query(query, [item_quantity, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Item count updated successfully');
    });
});
//Delete Method: Delete Data
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM cart WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Item deleted successfully');
    });
});

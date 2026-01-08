const express = require('express' ) ;
const mysql = require('mysql2/promise' );
require('dotenv').config();
const port = 3000;
const dbConfig = {
    host: process. env. DB_HOST,
    user: process.env.DB_USER,
    password: process. env. DB_PASSWORD,
    database: process.env. DB_NAME,
    port: process. env. DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};
const app = express();
app.use(express.json());

//Start the server
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});

// Example Route: Get all cards

app.get('/allcards', async (req, res) => {
    try {
        let connection = await mysql. createConnection(dbConfig);
        const [rows] = await connection. execute('SELECT * FROM defaultdb.cards');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res. status(500). json({ message: 'Serverr error for allcards' });
    }
});

app.post('/addcard', async (req, res) => {
    const {cardname, cardpic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cards (cardname, cardpic) VALUES (?, ?)', [cardname, cardpic]);
        res.status(201).json({message: 'Card ' + cardname + ' added successfully'});
    } catch (err) {
        console.error("DB ERROR:", err);
        return res.status(500). json({
            message: "DB error",
            error: err.message,
            sqlMessage: err.sqlMessage
        });
    }
});

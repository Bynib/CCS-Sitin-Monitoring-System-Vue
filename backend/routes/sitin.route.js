import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM sitin", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

// router.post('/', (req, res) => {
//        connection.query("INSERT INTO Sitin VALUES (")
// } )
import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM reservation", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    connection.query(
        "INSERT INTO reservation (student_id, date, start_time, end_time) VALUES (?, ?, ?, ?)",
    )
})
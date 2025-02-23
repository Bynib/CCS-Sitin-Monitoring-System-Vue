import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM Announcement", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { title, content } = req.body;
    connection.query(
        "INSERT INTO Announcement (announcement_title, announcement_content) VALUES (?, ?)",
        [title, content],
        (err, rows, fields) => {
            if (err) throw err;
            res.json(rows);
        }
    )
})

export default router;
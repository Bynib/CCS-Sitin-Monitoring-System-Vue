import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { title, content, reciever } = req.body;
    connection.query(
        "INSERT INTO Notification (notif_title, notif_content, recipient_id) VALUES (?, ?, ?)",
        [title, content, reciever],
        (err, rows, fields) => {
            if (err) throw err;
            res.json(rows);
        }
    )
})

router.get('/', (req, res) => {
    connection.query("SELECT * FROM Notification", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
})


export default router;
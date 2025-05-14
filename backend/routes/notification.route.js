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

router.get('/find/:id', (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM Notification WHERE notif_id = ?", [id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
})

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const {status} = req.body;
    connection.query("UPDATE notification SET status = ? WHERE notif_id = ?", [status, id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

router.put('/updateall/:idno', (req, res) => {
    const idno = req.params.idno;
    console.log("idno: ", idno)
    connection.query("UPDATE notification SET status = 'read' WHERE recipient_id = ?", [idno], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

router.delete('/delete/:id', (req, res) => {
    const notif_id = req.params.id;
    connection.query("DELETE FROM notification WHERE notif_id = ?", [notif_id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

export default router;
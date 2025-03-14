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

router.put('/update/:id', (req, res) => {
    const announcement_id = req.params.id;
    const { title, content } = req.body;
    connection.query("UPDATE Announcement SET announcement_title = ?, announcement_content = ?, announcement_date = CURRENT_TIMESTAMP WHERE announcement_id = ?", [title, content, announcement_id],
        (err, rows, fields) => {
            if(err) throw err;
            res.json(rows);
    })
})

router.delete('/delete/:id', (req, res) => {
    const announcement_id = req.params.id;
    connection.query("DELETE FROM Announcement WHERE announcement_id = ?", [announcement_id],
        (err, rows, fields) => {
            if(err) throw err;
            res.json(rows);
        }
    )
    console.log(announcement_id)
})
export default router;
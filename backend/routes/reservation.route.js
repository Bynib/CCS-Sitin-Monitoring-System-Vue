import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT r.id, s.idno, s.firstname, s.middlename, s.lastname, s.email, s.yearlevel, s.course, labno, pcno, date, end_time, purpose, startTime, status FROM reservation r JOIN student s ON r.idno = s.idno ORDER BY date DESC;", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { idno, date, startTime, pcno, purpose, labno } = req.body;

    connection.query(
        "INSERT INTO reservation (idno, labno, pcno, date, startTime, purpose) VALUES (?, ?, ?, ?, ?, ?)",
        [idno, labno, pcno, date, startTime, purpose], (err, rows, fields) => {
            if (err) throw err;
            res.json(rows);
        }
    )
})

router.get('/:labno/:pcno', (req, res) => {
    const labno = req.params.labno;
    const pcno = req.params.pcno;
    connection.query("SELECT * FROM reservation WHERE labno = ? AND pcno = ?", [labno, pcno], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
})

router.put('/approve/:id',  (req, res) => {
    const id = req.params.id;
    connection.query("UPDATE reservation SET status = 'approved', end_time = NULL WHERE id = ?", [ id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

router.put('/decline/:id',  (req, res) => {
    const id = req.params.id;
    connection.query("UPDATE reservation SET status = 'declined', end_time = NULL WHERE id = ?", [ id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

export default router;

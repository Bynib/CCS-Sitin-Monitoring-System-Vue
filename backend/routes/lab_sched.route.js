import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/:lab", (req, res) => {
    const lab = req.params.lab;
    connection.query("SELECT * FROM lab_sched WHERE lab_number = ?", [lab], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.put("/update", (req, res) => {
    const {lab, time, day, status} = req.body;
    console.log(lab, time, day, status)
    console.log(`UPDATE lab_sched SET status = '${status}' WHERE lab_number = '${lab}' AND time = '${time}' AND days = '${day}'`)
    connection.query("UPDATE lab_sched SET status = ? WHERE lab_number = ? AND time = ? AND days = ?", [status, lab, time, day], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

export default router;
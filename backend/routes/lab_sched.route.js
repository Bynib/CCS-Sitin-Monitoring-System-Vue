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

export default router;
import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM record", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
})

router.post('/', (req, res) => {
    const sitin_id = req.body;
    connection.query("INSERT INTO record (sitin_id) SELECT sitin_id, idno FROM sitin WHERE sitin_id = ?", [sitin_id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
    console.log(sitin_id)
})

export default router;
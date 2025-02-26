import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT s.sitin_id, s.idno, firstname, middlename, lastname, course, yearlevel, purpose, laboratory, date FROM sitin s JOIN student st ON s.idno = st.idno", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const {idno, purpose, laboratory} = req.body;
    connection.query("INSERT INTO sitin (idno, purpose, laboratory) VALUES (?,?,?)",[idno, purpose, laboratory], (err, rows, fields) => {
        if(err) throw err;
        res.json(rows);
    })
})

router.delete('/delete/:id', (req, res) => {
    const sitin_id = req.params.id;
    connection.query("DELETE FROM sitin WHERE sitin_id = ?", [sitin_id],
        (err, rows, fields) => {
            if(err) throw err;
            res.json(rows);
        }

    )
    console.log(sitin_id)
})

export default router;
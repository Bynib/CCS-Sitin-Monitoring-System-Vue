import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT s.sitin_id, s.idno, firstname, middlename, lastname, course, yearlevel, purpose, laboratory, date, LoggedOut, feedback FROM sitin s JOIN student st ON s.idno = st.idno", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const {idno, purpose, laboratory} = req.body;
    connection.query("INSERT INTO sitin (idno, purpose, laboratory) SELECT ?, ?, ? FROM dual WHERE NOT EXISTS(SELECT 1 FROM sitin WHERE idno=? AND LoggedOut is NULL)",[idno, purpose, laboratory, idno], (err, rows, fields) => {
        if(err) throw err;
        console.log(rows.affectedRows)
        res.json({success: rows.affectedRows === 1});
    })
})

router.get("/find/:id", (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM sitin WHERE idno = ? && LoggedOut is NULL", [id], (err, rows, fields) => {
        if(err) throw err.message;
        res.json(rows);
    })
    console.log(id)
})

router.put('/update/time/:id', (req, res) => {
    const sitin_id = req.params.id;
    connection.query("UPDATE sitin SET LoggedOut = CURRENT_TIMESTAMP WHERE sitin_id = ?", [sitin_id],
        (err, rows, fields) => {
            if(err) throw err;
            res.json(rows);
    })

})

router.put('/update/feedback/:id', (req, res) => {
    const sitin_id = req.params.id;
    const {feedback} = req.body;
    connection.query("UPDATE sitin SET feedback = ? WHERE sitin_id = ?", [feedback, sitin_id],
        (err, rows, fields) => {
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
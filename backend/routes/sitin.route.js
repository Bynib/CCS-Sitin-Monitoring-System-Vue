import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT s.sitin_id, s.idno, firstname, middlename, lastname, course, yearlevel, purpose, laboratory, date, LoggedOut, feedback, pcno FROM sitin s JOIN student st ON s.idno = st.idno", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const {idno, purpose, laboratory, pcno, origin} = req.body;
    connection.query(
        "INSERT INTO sitin (idno, purpose, laboratory, pcno, sitin_from) SELECT ?, ?, ?, ?, ? FROM dual WHERE NOT EXISTS(SELECT 1 FROM sitin WHERE idno=? AND LoggedOut is NULL)",
        [idno, purpose, laboratory, pcno, origin, idno], 
        (err, rows, fields) => {
            if(err) throw err;
            console.log(rows.affectedRows)
            res.json({success: rows.affectedRows === 1});
        }
    )
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

router.post('/add', (req, res) => {
    const { id, idno, date, startTime, pcno, purpose, labno, origin } = req.body;
    
    if (!id || !idno || !date || !startTime || !purpose || !labno || !origin) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    console.log(`CREATE EVENT add_${id}_on_schedule ON SCHEDULE AT '${date} ${startTime}:00' DO INSERT INTO sitin (idno, purpose, laboratory, pcno, sitin_from) VALUES (${idno}, '${purpose}', '${labno}', '${pcno}', '${origin}')`);
    
    connection.query(
        `CREATE EVENT  insert_${id}_on_schedule ON SCHEDULE AT '${date} ${startTime}:00' DO INSERT INTO sitin (idno, purpose, laboratory, pcno, sitin_from) VALUES (?, ?, ?, ?, ?)`,
        // `CREATE EVENT  insert_${id}_on_schedule ON SCHEDULE AT '2025-05-16 12:36:59' DO INSERT INTO sitin (idno, purpose, laboratory, pcno, sitin_from) VALUES (?, ?, ?, ?, ?)`,
        [ idno, purpose, labno, pcno, origin],
        (err, rows, fields) => {
            if (err) {
                console.error('Error creating event:', err);
                return res.status(500).json({ error: "Failed to create event" });
            }
            return res.json({ 
                message: "Event created successfully",
                eventDetails: {
                    idno,
                    date,
                    startTime,
                    purpose,
                    labno,
                    pcno
                }
            });
        }
    );
});
export default router;
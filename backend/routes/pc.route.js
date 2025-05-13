import express from "express";
import connection from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM pc ORDER BY labno, pcno", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

router.put('/update', (req, res) => {
    const { pcno, labno, status } = req.body;
    
    // Validate input
    if (!pcno || !labno || !status) {
        return res.status(400).json({ error: "pcno, labno, and status are required" });
    }

    // Check if status is valid (assuming status can be 'available' or 'unavailable')
    if (status !== 'available' && status !== 'unavailable') {
        return res.status(400).json({ error: "status must be either 'available' or 'unavailable'" });
    }

    connection.query(
        "UPDATE pc SET status = ? WHERE pcno = ? AND labno = ?",
        [status, pcno, labno],
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "PC not found" });
            }
            
            res.json({ message: "PC status updated successfully" });
        }
    );
});

//get availble pc by labno
router.get('/available/:labno', (req, res) => {
    const labno = req.params.labno;
    connection.query("SELECT * FROM pc WHERE labno = ? AND status = 'available'", [labno], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

export default router;
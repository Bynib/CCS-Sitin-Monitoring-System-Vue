import express from "express";
import connection from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM file", (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });    
});

router.get("/:id", (req, res) => {
    connection.query("SELECT * FROM file WHERE id = ?", [id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
})

router.post("/", (req, res) => {
    const {filename, filedata} = req.body;
    connection.query("INSERT INTO file (filename, filedata) VALUES (?, ?)", [filename, filedata], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM file WHERE id = ?", [id], (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    })
})

export default router;
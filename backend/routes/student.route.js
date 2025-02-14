import express from "express";
import connection from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  connection.query("SELECT * FROM student", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const lowercaseUsername = username.toLowerCase()
  console.log(`Select * FROM student WHERE username = ${lowercaseUsername} AND password = ${password}`);
  connection.query(
    "SELECT * FROM student WHERE username = ? AND password = ?",
    [lowercaseUsername, password],
    (err, rows, fields) => {
      if (err) throw err;
      console.log(rows)
      if (rows.length === 0 || rows[0] === undefined){
          res.json({success: false, message: "Invalid username or password"});
      } else {
          res.json({success: true, message: "Login successful", studentInfo:rows[0]});
      }
    }
  );
})


router.get("/:username", (req, res) => {
  const username = req.params.id;
  connection.query(
    "SELECT * FROM student WHERE username = ?",
    [username],
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

router.post("/", (req, res) => {
  const {
    idno,
    lastname,
    firstname,
    middlename,
    course,
    yearlevel,
    email,
    username,
    password,
  } = req.body;
  connection.query(
    "INSERT INTO student VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      idno,
      lastname,
      firstname,
      middlename,
      course,
      yearlevel,
      email,
      username,
      password,
    ],
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

export default router;

import express from "express";
import connection from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  connection.query("SELECT * FROM student WHERE isAdmin = 0", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const lowercaseUsername = username.toLowerCase()
  connection.query(
    "SELECT * FROM student WHERE username = ? AND password = ? AND sessions > 0",
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

router.post("/update", (req, res) => {
  const { lastname, firstname, middlename, course, yearlevel, email, username, password, sessions, idno } = req.body;
  connection.query("UPDATE student SET lastname = ?, firstname = ?, middlename = ?, course = ?, yearlevel = ?, email = ?, username = ?, password = ?, sessions = ? WHERE idno = ?",
  [lastname, firstname, middlename, course, yearlevel, email, username, password, sessions, idno],
  (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  }
  )
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
    "INSERT INTO student(idno, lastname, firstname, middlename, course, yearlevel, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

router.post('/session/:id', (req, res) => {
  const id = req.params.id;
  connection.query("UPDATE student SET sessions = sessions-1 WHERE idno = ?", [id], (err, rows, fields) => {
    if (err) throw err;
})
})

export default router;

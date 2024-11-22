import express, { Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import { hashPassword, comparePasswords } from "./passwordHelpers";
import { error } from "console";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "vacation_app",
});

db.connect((err) => {
  if (err) {
    console.error("Error: ", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.use(cors());
app.use(express.static("public"));

// check dupe email
app.post("/register", (req: Request, res: Response): void => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All fields are requried" });
    return;
  }

  hashPassword(password)
    .then((hashedPassword) => {
      db.query(
        `INSERT INTO users (first_name, last_name, email, password, role) VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, "admin")`,
        (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              res
                .status(400)
                .json({ message: "User with that email already exists" });
              return;
            }
            res.status(500).json({ message: "DB error", error: err });
            return;
          }
          res.status(201).json({ message: "Successfully registered" });
        }
      );
    })
    .catch((error) => {
      res.status(500).json({ message: "Password error", error });
    });
});

app.post("/login", (req, res) => {});

app.post("/vacation", (req, res) => {});

app.put("/vacation", (req, res) => {});

app.get("/vacations", (req, res) => {});

app.listen(3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});

import express, { Application, Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formidable, { Fields, Files } from "formidable";
import path from "path";
import fs from "fs";
import { User, Vacation } from "./types";
import { hashPassword, comparePasswords } from "./passwordHelpers";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "a086241da7c28c774676bb9074bd49edfe709abef83efc5a457992e183693f70";
const imageFolder = path.join(__dirname, "public");

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

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

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
        `INSERT INTO users (first_name, last_name, email, password, role) VALUES ("${firstName}", "${lastName}", "${email}", "${hashedPassword}", "user")`,
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

          db.query(
            `SELECT * FROM users WHERE email = "${email}"`,
            (_: any, result: User[]) => {
              const user: User = result[0];

              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  name: `${user.first_name} ${user.last_name}`,
                },
                JWT_SECRET,
                {
                  expiresIn: "24h",
                }
              );

              res.status(201).json({
                message: "Successfully registered and logged in",
                token,
              });
            }
          );
        }
      );
    })
    .catch((error) => {
      res.status(500).json({ message: "Password error", error });
    });
});

app.post("/login", (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please do not leave any fields empty" });
    return;
  }

  db.query(
    `SELECT * FROM users WHERE email = "${email}"`,
    (err, results: any[]) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
        return;
      }

      if (results.length === 0) {
        res
          .status(400)
          .json({ message: "No user found with that email address" });
        return;
      }

      const user = results[0];
      comparePasswords(password, user.password)
        .then((match) => {
          if (!match) {
            res.status(400).json({ message: "Invalid password" });
            return;
          }

          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.role,
              name: `${user.first_name} ${user.last_name}`,
            },
            JWT_SECRET,
            {
              expiresIn: "24h",
            }
          );

          res.status(200).json({ message: "Logged on!", token });
          return;
        })
        .catch((err) => {
          res.status(500).json({ message: "Error ", err });
          return;
        });
    }
  );
});

// DO THIS
app.post("/vacation", (req, res): void => {
  const form = formidable({
    multiples: false,
    uploadDir: imageFolder,
    keepExtensions: true,
  });

  form.parse(req, (err, fields: Fields, files: Files) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    db.query(
      `INSERT INTO vacations (destination, description, start_date, end_date, price, image_name) 
      VALUES
      ("${fields.destination}", "${fields.description}", "${
        new Date(fields.startDate![0]).toISOString().split("T")[0]
      }",
       "${new Date(fields.endDate![0]).toISOString().split("T")[0]}",
        "${fields.price}", "${files!.image![0].originalFilename}")`,
      (err) => {
        if (err) {
          res.status(500).json({ message: "DB error", error: err });
          return;
        }
      }
    );

    res.status(200).send({ fields, files });
  });
});

app.put("/vacation", (req, res) => {});

app.get("/vacations", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

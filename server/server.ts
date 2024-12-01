import express, { Application, Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import formidable, { Fields, Files } from "formidable";
import path from "path";
import fs from "fs";
import { User } from "./types";
import { hashPassword, comparePasswords } from "./passwordHelpers";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "a086241da7c28c774676bb9074bd49edfe709abef83efc5a457992e183693f70";
const imageFolder = path.join(__dirname, "public");

const db = mysql.createConnection({
  host: "db", // "db" for docker otherwise "localhost"
  port: 3306,
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
app.use("/public", express.static(path.join(__dirname, "public")));

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
                  firstName: user.first_name,
                  lastName: user.last_name,
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
              firstName: user.first_name,
              lastName: user.last_name,
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

app.get("/vacations", (req, res): void => {
  db.query("SELECT * FROM vacations ORDER BY start_date", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json(results);
  });
});

app.post("/vacation", (req, res): void => {
  const form = formidable({
    multiples: false,
    uploadDir: imageFolder,
    keepExtensions: true,
  });

  form.parse(req, (err, fields: Fields, files: Files) => {
    if (err) {
      res.status(500).json({ message: "Form parse error", error: err });
      return;
    }

    db.query(
      `INSERT INTO vacations (destination, description, start_date, end_date, price, image_name) 
      VALUES
      ("${fields.destination}", "${fields.description}", "${
        new Date(fields.startDate![0]).toISOString().split("T")[0]
      }",
       "${new Date(fields.endDate![0]).toISOString().split("T")[0]}",
        "${fields.price}", "${files!.image![0].newFilename}")`,
      (err) => {
        if (err) {
          res.status(500).json({ message: "DB error", error: err });
          return;
        }
      }
    );

    res.status(200).json({ fields, files });
  });
});

app.put("/vacation/:id", (req, res) => {
  if (req.headers["content-type"] === "application/json") {
    const formattedDates = {
      startDate: new Date(req.body.startDate).toISOString().split("T")[0],
      endDate: new Date(req.body.endDate).toISOString().split("T")[0],
    };

    db.query(
      `UPDATE vacations set destination = '${req.body.destination}', description = '${req.body.description}', start_date = '${formattedDates.startDate}',end_date = '${formattedDates.endDate}', price = ${req.body.price}
        WHERE vacations.id = ${req.params.id}`,
      (err) => {
        if (err) {
          res.status(500).json({ message: "DB error", error: err });
          return;
        }
        res.status(200).json({ message: "Edit success" });
        return;
      }
    );
  } else {
    db.query(
      `SELECT image_name FROM vacations WHERE vacations.id = ${req.params.id}`,
      (err, dbResponse: any[]) => {
        if (err) {
          res.status(500).json({ message: "DB error", error: err });
          return;
        }
        const filename = dbResponse[0]!.image_name;

        fs.unlink(`/app/public/${filename}`, (err) => {
          if (err) {
            res
              .status(500)
              .json({ message: "Image deletion error", error: err });
          }
        });
      }
    );

    const form = formidable({
      multiples: false,
      uploadDir: imageFolder,
      keepExtensions: true,
    });

    form.parse(req, (err, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ message: "Form parse error", error: err });
        return;
      }

      db.query(
        `UPDATE vacations set destination = '${
          fields.destination
        }', description = '${fields.description}', start_date = '${
          new Date(fields.startDate![0]).toISOString().split("T")[0]
        }',end_date = '${
          new Date(fields.endDate![0]).toISOString().split("T")[0]
        }', price = ${fields.price}, image_name = '${
          files.image![0].newFilename
        }'
        WHERE vacations.id = ${req.params.id}`,
        (err) => {
          if (err) {
            res.status(500).json({ message: "DB error", error: err });
            return;
          }
        }
      );
    });
  }
});

app.delete("/vacation", (req, res) => {
  const { vacation_id } = req.body;

  db.query(
    `SELECT image_name FROM vacations WHERE vacations.id = ${vacation_id}`,
    (err, dbResponse: any[]) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
        return;
      }
      const filename = dbResponse[0]!.image_name;

      fs.unlink(`/app/public/${filename}`, (err) => {
        if (err) {
          res.status(500).json({ message: "Image deletion error", error: err });
        }
      });
    }
  );

  db.query(
    `DELETE FROM vacations WHERE vacations.id = ${vacation_id}`,
    (err) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
      }
    }
  );

  res
    .status(200)
    .json({ message: `Deleted vacation with ID of ${vacation_id}` });
});

app.post("/follow", (req, res) => {
  db.query(
    `INSERT INTO follows (user_id, vacation_id) VALUES (${req.body.user_id}, ${req.body.vacation_id})`,
    (err) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
      }
    }
  );

  res.status(200).json({ message: "Follow success" });
});

app.get("/following", (req, res) => {
  db.query(
    `SELECT * FROM follows WHERE (user_id, vacation_id) = (${req.query.user_id} ,${req.query.vacation_id})`,
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
        return;
      }

      res.status(200).json(results);
    }
  );
});

app.get("/following_number", (req, res) => {
  db.query(
    `SELECT * FROM follows WHERE (vacation_id) = (${req.query.vacation_id})`,
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
        return;
      }

      res.status(200).json(results);
    }
  );
});

app.delete("/unfollow", (req, res) => {
  db.query(
    `DELETE FROM follows WHERE (user_id, vacation_id) = (${req.body.user_id}, ${req.body.vacation_id})`,
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "DB error", error: err });
        return;
      }

      res.status(200).json(results);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

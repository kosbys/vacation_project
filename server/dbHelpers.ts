import fs from "fs";
import mysql, { RowDataPacket } from "mysql2";

// move db queries here

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

const deleteImage = (vacation_id: number): boolean => {
  db.query<RowDataPacket[]>(
    `SELECT image_name FROM vacations WHERE vacations.id = ${vacation_id}`,
    (err, results) => {
      if (err) {
        return false;
      }

      if (results) {
        const imageName = results[0]?.image_name;
        fs.unlink(`/app/public/${imageName}`, (err) => {
          console.error("Error", err?.message);
        });
      }
    }
  );

  return true;
};

export {};



const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/cv.db");


db.serialize(() => {
db.run("DROP TABLE IF EXISTS course;");
db.run(`
    CREATE TABLE course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    syllabus TEXT NOT NULL,
    progression TEXT NOT NULL
    );
   
 `);

});
 db.close();
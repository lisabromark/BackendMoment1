
const express = require("express");
const bodyParser = require("body-parser"); //för att läsa in form-data
const sqlite3 = require("sqlite3").verbose();

//ansluter till db

const db = new sqlite3.Database("./db/cv.db");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    db.all("SELECT * FROM course;", (err, rows) => {
        if (err) {
            console.error(err.message);
        }

        res.render("index", {
            courseList: rows
        });

    });

});

app.get("/addcourse", (req, res) => {
    res.render("addcourse");
});

app.post("/addcourse", (req, res) => {

    // läs in formulärdata
    let code = req.body.code;
    let name = req.body.name;
    let syllabus = req.body.syllabus;
    let progression = req.body.progression;

    let error = null;

    //validera input
    if (code !== "" && name !== "" && syllabus !== "" && progression !== "") {
        //har VALUES (?,?,?,?) för att göra koden säkrare och undvika sårbarhet
        const stmt = db.prepare("INSERT INTO course(code, name, syllabus, progression)VALUES(?,?,?,?)");
        stmt.run(code, name, syllabus, progression, (err) => {
            if (err) {
                console.error("Databasfel!", err.message)
            }
        });

        stmt.finalize();

        // redirect till sida med kurser
        res.redirect("/");

    } else {
        error = "Alla fält måste vara ifyllda!";
        return res.render("addcourse", {
            error
        });
    }

});

app.get("*/delete/:id", (req, res) => {
    let id = req.params.id;

    //radera inlägg
    db.run("DELETE FROM course WHERE id =?;", id, (err) => {
        if (err) {
            console.error(err.message);
        }
        //redirect till startsida
        res.redirect("/");
    });

});


app.get("/about", (req, res) => {
    res.render("about");
});

//starta applikationen

app.listen(port, () => {
    console.log("Server started on port" + port);
});
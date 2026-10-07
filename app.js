require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const { sequelize } = require("./models");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session({ secret: process.env.SESSION_SECRET || "dev", resave: false, saveUninitialized: false }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => res.redirect("/dashboard"));
app.get("/dashboard", (req, res) => res.render("dashboard/index", { title: "Dashboard" }));

// AUTO-R-START
// AUTO-R-END

app.use((req, res) => res.status(404).send("404 - Page Not Found"));

sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log("Server running: http://localhost:3000")
  );
}).catch(err => {
  console.error("DB Error:", err.message);
});

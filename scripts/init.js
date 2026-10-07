const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '..');
const w = (p, c) => { fs.mkdirSync(path.dirname(path.join(R, p)), { recursive: true }); fs.writeFileSync(path.join(R, p), c); console.log('+ ' + p); };

// ---- SQLite database connection ----
w('config/database.js', `const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
  logging: false
});

module.exports = sequelize;
`);

w('models/index.js', `const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// AUTO-M-START
// AUTO-M-END
const db = { sequelize, Sequelize,
// AUTO-E-START
// AUTO-E-END
};
module.exports = db;
`);

w('middleware/auth.js', `module.exports = (req, res, next) => {
  req.session.user = req.session.user || { id: 1, name: "Admin" };
  res.locals.user = req.session.user;
  next();
};
`);

w('app.js', `require("dotenv").config();
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
`);

w('views/partials/header.ejs', `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><title><%= title || 'Logistics MVP' %></title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
</head><body>
<nav class="navbar navbar-dark bg-dark px-3">
  <span class="navbar-brand"><i class="bi bi-truck"></i> Logistics MVP</span>
  <span class="text-white"><%= (typeof user !== 'undefined' && user) ? user.name : 'Guest' %></span>
</nav>
<div class="container-fluid"><div class="row">
`);

w('views/partials/sidebar.ejs', `<nav class="col-md-2 d-md-block bg-light sidebar py-3" style="min-height:calc(100vh - 56px);">
<ul class="nav flex-column">
  <li class="nav-item"><a href="/dashboard" class="nav-link"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
  <!-- AUTO-N-START -->
  <!-- AUTO-N-END -->
</ul>
</nav>
`);

w('views/partials/footer.ejs', `</div></div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body></html>
`);

w('views/partials/flash.ejs', `<% if (success && success.length) { %><div class="alert alert-success alert-dismissible"><%= success %></div><% } %>
<% if (error && error.length) { %><div class="alert alert-danger alert-dismissible"><%= error %></div><% } %>
`);

w('views/dashboard/index.ejs', `<%- include('../partials/header') %>
<%- include('../partials/sidebar') %>
<main class="col-md-10 ms-sm-auto px-md-4 py-4">
  <h2>Dashboard</h2>
  <p class="text-muted">Welcome to Smart Logistics MVP (SQLite Edition).</p>
  <div class="alert alert-info">
    <strong>Tip:</strong> Use the sidebar to navigate to Trucks, Drivers, Loads, Shipments, and more.
  </div>
</main>
<%- include('../partials/footer') %>
`);

w('.env', `PORT=3000
SESSION_SECRET=change-me-please-in-production
`);

w('.gitignore', `node_modules/
database.sqlite
.env
public/uploads/
`);

console.log('\n✅ Init complete. Now run: npm run generate:crud Truck');

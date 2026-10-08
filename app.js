require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const { sequelize, Truck, Load, Trip } = require("./models");

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

app.get("/", (req, res) => res.redirect("/login"));
app.get("/dashboard", async (req, res) => {
  try {
    const totalTrucks = await Truck.count();
    const availableTrucks = await Truck.count({ where: { status: 'available' } });
    
    // For loads, assuming 'posted' is active
    const activeLoads = await Load.count({ where: { status: 'posted' } });
    
    // Total bookings could be all trips or shipments, let's use Trips count
    const totalBookings = await Trip.count();
    
    // Distance calculation
    const distanceResult = await Trip.sum('distance_km');
    const totalDistance = distanceResult || 0;
    
    const tripsWithDistance = await Trip.count({ where: { distance_km: { [sequelize.Sequelize.Op.gt]: 0 } } });

    res.render("dashboard/index", { 
      title: "Dashboard",
      stats: {
        totalTrucks,
        availableTrucks,
        activeLoads,
        totalBookings,
        totalDistance,
        tripsWithDistance
      }
    });
  } catch (error) {
    console.error(error);
    res.render("dashboard/index", { 
      title: "Dashboard",
      stats: { totalTrucks: 0, availableTrucks: 0, activeLoads: 0, totalBookings: 0, totalDistance: 0, tripsWithDistance: 0 }
    });
  }
});

// AUTO-R-START
app.use('/drivers', require('./routes/driversRoutes'));
app.use('/expenses', require('./routes/expensesRoutes'));
app.use('/insurance_policies', require('./routes/insurance_policiesRoutes'));
app.use('/loads', require('./routes/loadsRoutes'));
app.use('/master_loads', require('./routes/master_loadsRoutes'));
app.use('/payments', require('./routes/paymentsRoutes'));
app.use('/shipments', require('./routes/shipmentsRoutes'));
app.use('/trips', require('./routes/tripsRoutes'));
app.use('/trucks', require('./routes/trucksRoutes'));
app.use('/warehouses', require('./routes/warehousesRoutes'));
// AUTO-R-END

// Placeholder Routes for Side Menu
app.get('/bookings', (req, res) => res.render('bookings/index', { title: 'Bookings' }));
app.get('/pricing', (req, res) => res.render('pricing/index', { title: 'Pricing Calculator' }));
app.get('/reports', (req, res) => res.render('reports/index', { title: 'Reports' }));
app.get('/settings', (req, res) => res.render('settings/index', { title: 'Settings' }));

// Auth Routes (Dummy)
app.get('/login', (req, res) => res.render('auth/login', { layout: false }));
app.post('/login', (req, res) => res.redirect('/dashboard'));
app.get('/register', (req, res) => res.render('auth/register', { layout: false }));
app.post('/register', (req, res) => res.redirect('/dashboard'));
app.get('/logout', (req, res) => res.redirect('/login'));

app.use((req, res) => res.status(404).send("404 - Page Not Found"));

sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log("Server running: http://localhost:3000")
  );
}).catch(err => {
  console.error("DB Error:", err.message);
});

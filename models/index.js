const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Truck = require("./Truck");
const Load = require("./Load");
const Trip = require("./Trip");
const Driver = require("./Driver");
const Shipment = require("./Shipment");
const Warehouse = require("./Warehouse");
const Payment = require("./Payment");
const Expense = require("./Expense");
const MasterLoad = require("./MasterLoad");
const InsurancePolicy = require("./InsurancePolicy");

const db = { 
  sequelize, 
  Sequelize,
  Truck, Load, Trip, Driver, Shipment, Warehouse, Payment, Expense, MasterLoad, InsurancePolicy
};
module.exports = db;

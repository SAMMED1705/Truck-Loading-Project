const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Driver = sequelize.define("Driver", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    license_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    license_expiry: { type: DataTypes.DATE },
    experience_years: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM("available","on_trip","inactive"), defaultValue: "available" }
}, { tableName: "drivers", timestamps: true, underscored: true });

module.exports = Driver;

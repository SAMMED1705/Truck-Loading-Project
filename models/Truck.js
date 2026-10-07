const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Truck = sequelize.define("Truck", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vehicle_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    vehicle_type: { type: DataTypes.ENUM("truck","trailer","container","tempo"), defaultValue: "truck" },
    capacity_kg: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    insurance_policy_number: { type: DataTypes.STRING },
    insurance_expiry: { type: DataTypes.DATE },
    gps_device_id: { type: DataTypes.STRING },
    gps_active: { type: DataTypes.BOOLEAN, defaultValue: false },
    current_location: { type: DataTypes.STRING },
    owner_id: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM("available","on_trip","inactive"), defaultValue: "available" }
}, { tableName: "trucks", timestamps: true, underscored: true });

module.exports = Truck;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Shipment = sequelize.define("Shipment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    shipment_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    pickup_location: { type: DataTypes.STRING, allowNull: false },
    delivery_location: { type: DataTypes.STRING, allowNull: false },
    freight_amount: { type: DataTypes.DECIMAL(12,2) },
    status: { type: DataTypes.ENUM("pending","assigned","in_transit","delivered"), defaultValue: "pending" }
}, { tableName: "shipments", timestamps: true, underscored: true });

module.exports = Shipment;

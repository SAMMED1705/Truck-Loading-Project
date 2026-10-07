const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MasterLoad = sequelize.define("MasterLoad", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    master_load_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    container_number: { type: DataTypes.STRING },
    total_weight_kg: { type: DataTypes.DECIMAL(12,2) },
    origin: { type: DataTypes.STRING },
    destination: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM("in_transit","arrived","split","dispatched"), defaultValue: "in_transit" }
}, { tableName: "master_loads", timestamps: true, underscored: true });

module.exports = MasterLoad;

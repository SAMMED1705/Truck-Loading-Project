const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Load = sequelize.define("Load", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    load_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    commodity: { type: DataTypes.STRING, allowNull: false },
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    weight_kg: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    pickup_from: { type: DataTypes.DATE, allowNull: false },
    offered_price: { type: DataTypes.DECIMAL(12,2) },
    status: { type: DataTypes.ENUM("posted","matched","booked","delivered"), defaultValue: "posted" }
}, { tableName: "loads", timestamps: true, underscored: true });

module.exports = Load;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Warehouse = sequelize.define("Warehouse", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    contact_phone: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM("active","inactive"), defaultValue: "active" }
}, { tableName: "warehouses", timestamps: true, underscored: true });

module.exports = Warehouse;

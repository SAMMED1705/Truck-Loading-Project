const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Trip = sequelize.define("Trip", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    trip_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    start_date: { type: DataTypes.DATE },
    start_location: { type: DataTypes.STRING },
    end_location: { type: DataTypes.STRING },
    distance_km: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    status: { type: DataTypes.ENUM("planned","started","completed"), defaultValue: "planned" }
}, { tableName: "trips", timestamps: true, underscored: true });

module.exports = Trip;

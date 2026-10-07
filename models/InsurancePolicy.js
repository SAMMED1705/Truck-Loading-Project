const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InsurancePolicy = sequelize.define("InsurancePolicy", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    policy_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    policy_type: { type: DataTypes.ENUM("vehicle","cargo","driver"), allowNull: false },
    provider_name: { type: DataTypes.STRING, allowNull: false },
    coverage_amount: { type: DataTypes.DECIMAL(12,2) },
    end_date: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM("active","expired"), defaultValue: "active" }
}, { tableName: "insurance_policies", timestamps: true, underscored: true });

module.exports = InsurancePolicy;

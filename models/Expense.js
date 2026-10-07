const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expense = sequelize.define("Expense", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    expense_type: { type: DataTypes.ENUM("diesel","toll","driver_allowance","food","maintenance","other"), allowNull: false },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    expense_date: { type: DataTypes.DATE, allowNull: false }
}, { tableName: "expenses", timestamps: true, underscored: true });

module.exports = Expense;

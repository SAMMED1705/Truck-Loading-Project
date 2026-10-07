const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    payment_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    payment_date: { type: DataTypes.DATE },
    payment_method: { type: DataTypes.ENUM("cash","bank","upi","cheque"), defaultValue: "bank" },
    status: { type: DataTypes.ENUM("pending","paid"), defaultValue: "pending" }
}, { tableName: "payments", timestamps: true, underscored: true });

module.exports = Payment;

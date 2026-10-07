const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./database.sqlite",
	logging: console.log
});

const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log("sqlite connected");

		await sequelize.sync();
		console.log("Database sync");
	}catch (error) {
		console.error("sqlite failed", error.message);
		process.exit(1);
	}
};

module.exports = {
	sequelize,
	connectDB
};

require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/database");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("mvp is runnung");
});

const PORT = process.env.PORT || 3000

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => { 
        console.log("Server running on port 3000");
    });
};

startServer();

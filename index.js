const express = require("express");
const cors = require("cors");
const connection = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()
const userRouter = require("./route/user.route");
const PORT=process.env.PORT || 8080
app.use('/api/users', userRouter);

app.get("/", (req, res) => {
res.send("Welcome to GitHub User API");
  });

app.listen(PORT, async () => {
    console.log("Server connecting to DataBase");
    try {
    await connection;
    console.log(`Server connected to DataBase Port:-${PORT}`);
} catch (error) {
    console.log("Something Went Wrong:", error);
}
});

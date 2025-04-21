const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const ZingMp3Router = require("./src/routes/ZingRouter");
const AuthRouter = require("./src/routes/AuthRouter");
app.use("/api", ZingMp3Router);
app.use("/api/auth", AuthRouter)

// Home & Error
app.get("/", (req, res) => res.send("SERVER ON"));
app.get("*", (req, res) => res.send("Sai đường dẫn!"));

module.exports = app;

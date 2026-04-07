const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

const { errorHandler } = require("./middlewares/errorHandler.middleware");
const healthRouter = require("./routes/health.route");
const authRouter = require("./routes/auth.route");
const sessionRouter = require("./routes/session.route");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/session", sessionRouter);
app.use(errorHandler);

module.exports = app;

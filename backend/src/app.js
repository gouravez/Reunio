const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const { errorHandler } = require("./middlewares/errorHandler.middleware");
const healthRouter = require("./routes/health.route");
const authRouter = require("./routes/auth.route");
const sessionRouter = require("./routes/session.route");

const allowedOrigins = [
  "http://localhost:5173",
  "https://reunio-live.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/session", sessionRouter);
app.use(errorHandler);

module.exports = app;

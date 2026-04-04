const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL, 
  credentials: true, 
};

const healthRouter = require('./routes/health.route');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);
module.exports = app;
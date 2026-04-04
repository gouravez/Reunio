// const router = require("express").Router();
const express = require("express");
const router = express.Router();

const healthController = require("../controllers/health.controller");

router.get("/", healthController.healthCheck);

module.exports = router;

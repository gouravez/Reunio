const express = require("express");

function healthCheck(req, res) {
  res.status(200).json({ message: "Health check passed", status: "OK", timestamp: new Date().toLocaleString() });
}

module.exports = { healthCheck };

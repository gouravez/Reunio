const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

const errorHandler = require("../middlewares/errorHandler.middleware");
const { body } = require("express-validator");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please use a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  errorHandler.validationErrorHandler,
  authController.registerUser,
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please use a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  errorHandler.validationErrorHandler,
  authController.loginUser,
);

// GET /api/auth/me
router.get(
  "/me",
  authMiddleware.authenticateUser,
  authController.getCurrentUser,
);

module.exports = router;

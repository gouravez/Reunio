const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth.middleware");
const sessionController = require("../controllers/session.controller");

const errorHandler = require("../middlewares/errorHandler.middleware");
const { body } = require("express-validator");

router.use(authenticateUser);

// GET /api/session/list
router.get("/list", sessionController.listSession);

// POST /api/session/create
router.post("/create", sessionController.createSession);

// POST /api/session/join
router.post(
  "/join",
  [body("roomId").trim().notEmpty().withMessage("RoomId is Required")],
  errorHandler.validationErrorHandler,
  sessionController.joinSession,
);

// GET /api/session/:roomId
router.get("/:roomId", sessionController.getSession);

// POST /api/session/end
router.post("/create", sessionController.endSession);

// POST /api/session/:roomId
router.post(
  "/leave",
  [body("roomId").trim().notEmpty().withMessage("RoomId is Required")],
  errorHandler.validationErrorHandler,
  sessionController.leaveSession,
);

module.exports = router;

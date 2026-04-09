const Session = require("../models/session.model");
const User = require("../models/user.model");
const { generateToken } = require("../utils/livekit.util.js");

const listSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const statusFilter = status && status !== "all" ? { status } : {};

    const session = await Session.find({
      $and: [
        statusFilter,
        {
          $or: [{ host: userId }, { "participants.userId": userId }],
        },
      ],
    }).sort({ createdAt: -1 });

    const result = session.map((s) => ({
      id: s._id,
      roomId: s.roomId,
      hostName: s.hostName,
      status: s.status,
      participantCount: s.participants.length || 0,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      isHost: s.host.toString() === userId.toString(),
    }));

    res.json({
      success: true,
      data: {
        sessions: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    // GENERATE ROOM ID
    let roomId;
    let attempts = 0;
    const maxAttempts = 10;
    do {
      roomId = Session.generateRoomId();
      const exists = await Session.roomIdExists(roomId);
      if (!exists) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts > maxAttempts) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate unique room Id. Please try again",
      });
    }

    const session = await Session.create({
      roomId,
      host: userId,
      hostName: user.name,
      participants: [{ userId, username: user.name }],
    });

    res.status(201).json({
      success: true,
      data: {
        session: {
          id: session._id,
          roomId: session.roomId,
          hostName: session.hostName,
          status: session.status,
          participantCount: session.participants.length,
          startedAt: session.startedAt,
          participants: session.participants,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const joinSession = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    if (!roomId)
      return res.status(400).json({
        success: false,
        error: "Room Id is required",
      });

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(400).json({
        success: false,
        error: "Session Not Found, Please Check the Room ID",
      });
    }

    if (session.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "Session has already been ended",
      });
    }

    // USER HAS ALREADY JOINED SESSION
    const alreadyJoined = session.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (alreadyJoined) {
      return res.json({
        success: true,
        data: {
          id: session._id,
          roomId: session.roomId,
          hostName: session.hostName,
          status: session.status,
          isHost: session.host.toString() === userId.toString(),
          participantCount: session.participants.length,
          participants: session.participants,
        },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    session.participants.push({ userId, username: user.name });
    await session.save();
    res.json({
      success: true,
      data: {
        id: session._id,
        roomId: session.roomId,
        hostName: session.hostName,
        status: session.status,
        isHost: session.host.toString() === userId.toString(),
        participantCount: session.participants.length,
        participants: session.participants,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getSession = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(400).json({
        success: false,
        error: "Session Not Found, Please Check the Room ID",
      });
    }

    const isParticipant = session.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    res.json({
      success: true,
      data: {
        id: session._id,
        roomId: session.roomId,
        hostName: session.hostName,
        status: session.status,
        isHost: session.host.toString() === userId.toString(),
        participantCount: session.participants.length,
        participants: session.participants,
        isParticipant,
      },
    });
  } catch (err) {
    next(err);
  }
};

const endSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({
        success: false,
        error: "Session Not Found",
      });
    }

    // VERIFY IF THE PARTICULAR USER IS A HOST
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only Host can end the Session",
      });
    }

    // ALREADY ENDED CHECK
    if (session.status === "ended") {
      return res.status(400).json({
        success: false,
        error: "Session has already ended",
      });
    }

    session.status = "ended";
    session.endedAt = new Date();
    await session.save();

    res.json({
      success: true,
      data: {
        id: session._id,
        roomId: session.roomId,
        status: session.status,
        endedAt: session.endedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const leaveSession = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    if (!roomId)
      return res.status(400).json({
        success: false,
        error: "Room Id is required",
      });

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(400).json({
        success: false,
        error: "Session Not Found",
      });
    }

    session.participants = session.participants.filter(
      (p) => p.userId.toString() !== userId.toString(),
    );
    await session.save();

    res.json({
      success: true,
      data: {
        message: "Session left successfully",
      },
    });
  } catch (err) {
    next(err);
  }
};

const getLiveKitToken = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    const user = await User.findById(userId);

    const token = await generateToken(roomId, user.name);

    res.json({
      success: true,
      data: { token },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Token generation failed",
    });
  }
};

module.exports = {
  listSession,
  createSession,
  joinSession,
  getSession,
  endSession,
  leaveSession,
  getLiveKitToken,
};

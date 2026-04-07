const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hostName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],

    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

sessionSchema.statics.generateRoomId = function () {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let roomId = "";
  for (let i = 0; i < 12; i++) {
    roomId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return roomId;
};

sessionSchema.statics.roomIdExists = async function (roomId) {
  const session = await this.findOne({ roomId });
  return !!session;
};

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;

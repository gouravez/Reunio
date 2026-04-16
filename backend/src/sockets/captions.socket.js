// backend/src/sockets/captions.socket.js

const { createDeepgramConnection } = require("../utils/deepgram.js");

const handleCaptions = (io) => {
  io.on("connection", (socket) => {
    // console.log("🟢 Client connected:", socket.id);

    const dgConnections = new Map();
    const buffers = new Map();
    const readyState = new Map();

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
      // console.log(`👥 ${socket.id} joined ${roomId}`);
    });

    socket.on("audio-chunk", (audio, meta) => {
      const { userId, roomId } = meta || {};
      if (!audio || !userId || !roomId) return;
      const key = `${roomId}_${userId}`;

      // console.log(audio instanceof ArrayBuffer);
      // console.log(audio.constructor.name);

      const chunk = audio;
      // console.log(chunk.slice(0, 20));
      // console.log(chunk.length);
      // console.log("Chunk size", chunk.length)

      // console.log(typeof chunk);

      if (!dgConnections.has(key)) {
        const dg = createDeepgramConnection(io, userId, roomId);

        dgConnections.set(key, dg);
        buffers.set(key, []);
        readyState.set(key, false);

        dg.on("open", () => {
          readyState.set(key, true);

          buffers.get(key).forEach((c) => dg.send(c));
          buffers.set(key, []);
        });
      }

      const dg = dgConnections.get(key);
      const isReady = readyState.get(key);

      if (isReady) {
        // console.log("REady");
        dg.send(chunk);
      } else {
        const buf = buffers.get(key);
        if (buf.length < 50) {
          buf.push(chunk);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);

      dgConnections.forEach((dg) => {
        try {
          dg.finish();
        } catch {}
      });

      dgConnections.clear();
      buffers.clear();
      readyState.clear();
    });
  });
};

module.exports = { handleCaptions };

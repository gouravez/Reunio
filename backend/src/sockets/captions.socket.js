// backend/src/sockets/captions.socket.js

const { createDeepgramConnection } = require("../utils/deepgram.js");

const handleCaptions = (io) => {
  io.on("connection", (socket) => {
    // console.log("🟢 Client connected:", socket.id);

    const dgConnections = new Map();
    const buffers = new Map();
    const readyState = new Map();

    socket.on("audio-chunk", (audio, meta) => {
      const { userId, roomId } = meta || {};
      if (!audio || !userId) return;

      console.log(audio instanceof ArrayBuffer); 
      console.log(audio.constructor.name);

      const chunk = audio;
      console.log(chunk.slice(0, 20));
      console.log(chunk.length);
      // console.log("Chunk size", chunk.length)

      // console.log(typeof chunk);

      if (!dgConnections.has(userId)) {
        const dg = createDeepgramConnection(socket, userId, roomId);

        dgConnections.set(userId, dg);
        buffers.set(userId, []);
        readyState.set(userId, false);

        dg.on("open", () => {
          // console.log(`🎧 DG ready for ${userId}`);
          readyState.set(userId, true);

          buffers.get(userId).forEach((c) => dg.send(c));
          buffers.set(userId, []);
        });
      }

      const dg = dgConnections.get(userId);
      const isReady = readyState.get(userId);

      if (isReady) {
        // console.log("REady");
        dg.send(chunk);
      } else {
        buffers.get(userId).push(chunk);
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

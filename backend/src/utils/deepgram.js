// backend/src/utils/deepgram.js

const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");

const createDeepgramConnection = (io, userId, roomId) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const dgConnection = deepgram.listen.live({
    model: "nova-2",
    language: "multi",
    punctuate: true,
    interim_results: true,
    encoding: "linear16",
    sample_rate: 16000,
    channels: 1,
  });

  dgConnection.on(LiveTranscriptionEvents.Open, () => {
    // console.log(`✅ Deepgram connected for user: ${userId}`);

    dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
      try {
        const alt = data.channel?.alternatives?.[0];
        if (!alt) return;

        // console.log(alt);
        const text = alt.transcript;
        // console.log(text);

        if (!text || text.trim().length === 0) return;

        io.to(roomId).emit("caption", {
          userId,
          roomId,
          text,
          isFinal: data.is_final,
        });
      } catch (err) {
        console.error("Transcript error:", err);
      }
    });
  });

  dgConnection.on(LiveTranscriptionEvents.Error, (err) => {
    console.error("❌ Deepgram error:", err);
  });

  dgConnection.on(LiveTranscriptionEvents.Close, () => {
    console.log(`🔌 Deepgram closed for user: ${userId}`);
  });

  return dgConnection;
};

module.exports = { createDeepgramConnection };

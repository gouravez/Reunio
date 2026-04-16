const app = require("./src/app");
const PORT = process.env.PORT || 3000;
const connectDB = require("./src/db/db");

const http = require("http");
const { Server } = require("socket.io");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://reunio-live.vercel.app",
    ],
    credentials: true,
  },
});

const { handleCaptions } = require("./src/sockets/captions.socket");
handleCaptions(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
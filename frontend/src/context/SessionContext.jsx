import { createContext, useContext, useState } from "react";
import { Room } from "livekit-client";
import api from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [room, setRoom] = useState(null);

  const joinRoom = async (roomId) => {
    try {
      const res = await api.post(API_ENDPOINTS.SESSION.TOKEN, { roomId });
      const token = res.data.data.token;

      const roomInstance = new Room();

      await roomInstance.connect(import.meta.env.VITE_LIVEKIT_URL, token);

      roomInstance.on("trackSubscribed", (track, publication, participant) => {
        if (track.kind === "video") {
          const el = track.attach();

          if (participant.isLocal) {
            document.getElementById("local-video")?.appendChild(el);
          } else {
            document.getElementById("remote-video")?.appendChild(el);
          }
        }
      });

      await roomInstance.localParticipant.enableCameraAndMicrophone();

      setRoom(roomInstance);
    } catch (err) {
      console.error("Join Room Error:", err);
    }
  };

  const leaveRoom = () => {
    room?.disconnect();
    setRoom(null);

    const local = document.getElementById("local-video");
    const remote = document.getElementById("remote-video");

    if (local) local.innerHTML = "";
    if (remote) remote.innerHTML = "";
  };

  return (
    <SessionContext.Provider value={{ joinRoom, leaveRoom, room }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);

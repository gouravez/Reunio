import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const Call = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { joinRoom, leaveRoom } = useSession();

  useEffect(() => {
    if (roomId) joinRoom(roomId);

    return () => leaveRoom();
  }, [roomId]);


  return (
    <div className="h-screen bg-black text-white">
      <div className="flex justify-between p-4">
        <h2>Room: {roomId}</h2>
        <button
          onClick={() => {
            leaveRoom();
            navigate("/dashboard");
          }}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Leave
        </button>
      </div>

      <div className="flex gap-4 p-4">
        <div>
          <h3>Local</h3>
          <div id="local-video"></div>
        </div>

        <div>
          <h3>Remote</h3>
          <div id="remote-video"></div>
        </div>
      </div>
    </div>
  );
};

export default Call;
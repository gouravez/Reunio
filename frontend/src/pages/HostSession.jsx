import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ use axios instance
import { API_ENDPOINTS } from "../utils/constants";

const HostSession = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    try {
      setLoading(true);

      const res = await api.post(API_ENDPOINTS.SESSION.CREATE);

      const data = res.data;

      if (!data.success) {
        throw new Error(data.error || "Failed to create session");
      }

      const roomId = data.data.session.roomId;

      navigate(`/call/${roomId}`);
    } catch (err) {
      console.error("Create Session Error:", err);
      alert("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-90">
        <h1 className="text-2xl font-bold mb-4">Host a Session</h1>

        <p className="text-gray-600 mb-6">
          Start a new video session and invite others using the room ID.
        </p>

        <button
          onClick={handleCreateSession}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Start Session"}
        </button>
      </div>
    </div>
  );
};

export default HostSession;
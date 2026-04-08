import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-[400px]">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="flex flex-col gap-4">
          {/* Host Session */}
          <button
            onClick={() => navigate(ROUTES.HOST)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition"
          >
            🎥 Start Session
          </button>

          {/* Join Session */}
          <button
            onClick={() => navigate(ROUTES.JOIN)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition"
          >
            🔗 Join Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
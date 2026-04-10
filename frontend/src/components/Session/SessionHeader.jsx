import React from "react";
import { ArrowLeft } from "lucide-react";

const SessionHeader = ({
  title,
  roomId,
  username,
  onBack,
  showEndButton,
  onEndSession,
}) => {
  return (
    <header className="bg-white shadow-sm border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">Room ID: {roomId}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {username && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold"> {username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SessionHeader;

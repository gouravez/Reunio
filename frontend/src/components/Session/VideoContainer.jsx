import React from "react";
import { CircleAlert, Expand, Loader, Video } from "lucide-react";
import { APP_CONFIG } from "../../utils/constants";

const VideoContainer = ({
  containerRef,
  isJoined,
  userHasJoined,
  livekitError,
  livekitLoading,
  onFullscreen,
  onLeave,
  leaveButtonText,
  isScreenSharing,
  onToggleScreenShare,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Video className="w-5 h-5 mr-2 text-blue-600" />
          {APP_CONFIG.SESSION_CONTENT.VIDEO.TITLE}
        </h2>
        <div className="flex items-center space-x-3">
          {isJoined && (
            <span className="flex items-center text-sm text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTED}
            </span>
          )}

          {isJoined && (
            <button
              onClick={onToggleScreenShare}
              className={`px-3 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                isScreenSharing
                  ? "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500"
              }`}
            >
              {isScreenSharing ? "Stop Share" : "Share Screen"}
            </button>
          )}

          <button
            onClick={onFullscreen}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Expand className="inline-block mr-1" />{" "}
            {APP_CONFIG.SESSION_CONTENT.VIDEO.FULLSCREEN}
          </button>
        </div>
      </div>

      {livekitError && (
        <div className="mb-4 bg-red-50 border-1-4 border-red-500 text-red-700 p-4 rounded-lg">
          <div className="flex items-center">
            <CircleAlert className="w-5 h-5 mr-2" />
            <span className="text-sm">{livekitError}</span>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-100 rounded-xl overflow-hidden bg-gray-900 border-2 border-gray-200 shadow-inner flex items-center justify-center"
      />
      {livekitLoading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-gray-600">
            <Loader className="animate-spin h-5 w-5 mr-2" />
            {APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTING}
          </div>
        </div>
      )}

      {onLeave && isJoined && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLeave}
            className="px-8 py-3  font-medium text-white bg-linear-to-r from-red-500 to-red-600  rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500  shadow-md transition-all transform hover:scale-105"
          >
            {leaveButtonText || APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;

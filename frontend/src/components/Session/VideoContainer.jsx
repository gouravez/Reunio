import React, { useEffect, useRef } from "react";
import { CircleAlert, Expand, Loader, Video } from "lucide-react";
import { APP_CONFIG } from "../../utils/constants";

const getGridClass = (count) => {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  return "grid-cols-4";
};

const VideoTile = ({ track, isScreen }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !track) return;

    const videoEl = ref.current;

    track.attach(videoEl);
    videoEl.style.objectFit = isScreen ? "contain" : "cover";

    return () => {
      track.detach(videoEl);
    };
  }, [track, isScreen]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      className={`w-full h-full rounded-lg bg-black ${
        isScreen ? "col-span-2 row-span-2" : ""
      }`}
    />
  );
};

const VideoContainer = ({
  containerRef,
  participants = [],
  isJoined,
  userHasJoined,
  livekitError,
  livekitLoading,
  onFullScreen,
  onLeave,
  leaveButtonText,
  isScreenSharing,
  onToggleScreenShare,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 border-gray-100">
      
      {/* Header */}
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
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isScreenSharing
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isScreenSharing ? "Stop Share" : "Share Screen"}
            </button>
          )}

          <button
            onClick={onFullScreen}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
          >
            <Expand className="inline-block mr-1" />
            {APP_CONFIG.SESSION_CONTENT.VIDEO.FULLSCREEN}
          </button>
        </div>
      </div>

      {/* Error */}
      {livekitError && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <div className="flex items-center">
            <CircleAlert className="w-5 h-5 mr-2" />
            <span className="text-sm">{livekitError}</span>
          </div>
        </div>
      )}

      {/* VIDEO GRID */}
      <div
        ref={containerRef}
        className={`grid gap-2 w-full h-[500px] bg-gray-900 rounded-xl p-2 ${getGridClass(
          participants.length
        )}`}
      >
        {participants.length === 0 ? (
          <div className="flex items-center justify-center text-gray-400">
            Waiting for participants...
          </div>
        ) : (
          participants.map((p, index) => (
            <VideoTile
              key={p.id + (p.isScreen ? "-screen" : "-cam") + index}
              track={p.track}
              isScreen={p.isScreen}
            />
          ))
        )}
      </div>

      {/* Loading */}
      {livekitLoading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-gray-600">
            <Loader className="animate-spin h-5 w-5 mr-2" />
            {APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTING}
          </div>
        </div>
      )}

      {/* Leave */}
      {onLeave && isJoined && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLeave}
            className="px-8 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            {leaveButtonText || APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
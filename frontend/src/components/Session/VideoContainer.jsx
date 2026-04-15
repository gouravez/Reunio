import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Maximize2,
  Users,
  Pin,
  MoreHorizontal,
} from "lucide-react";
import { APP_CONFIG } from "../../utils/constants";

const getGridLayout = (count) => {
  if (count === 1) return "grid-cols-1 grid-rows-1";
  if (count === 2) return "grid-cols-2 grid-rows-1";
  if (count <= 4) return "grid-cols-2 grid-rows-2";
  if (count <= 6) return "grid-cols-3 grid-rows-2";
  if (count <= 9) return "grid-cols-3 grid-rows-3";
  return "grid-cols-4 grid-rows-3";
};

const COLORS = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-green-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-teal-600",
];

const getInitials = (id = "") => id.slice(0, 2).toUpperCase();

const VideoTile = ({ participant, index, isPinned, onPin, isLocal }) => {
  const ref = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { track, isScreen, id } = participant;

  useEffect(() => {
    if (!ref.current || !track) return;
    const videoEl = ref.current;
    track.attach(videoEl);
    videoEl.style.objectFit = isScreen ? "contain" : "cover";
    return () => track.detach(videoEl);
  }, [track, isScreen]);

  const avatarColor = COLORS[index % COLORS.length];

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden bg-gray-800 group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={ref}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Avatar fallback (shown when no video) */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${avatarColor} text-white text-3xl font-semibold opacity-0 peer-empty:opacity-100`}
      >
        {getInitials(id)}
      </div>

      {/* Name tag */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
        {isMuted ? (
          <MicOff className="w-3 h-3 text-red-400" />
        ) : (
          <Mic className="w-3 h-3 text-green-400" />
        )}
        <span className="max-w-30 truncate">
          {isLocal ? `${id} (You)` : id}
        </span>
        {isScreen && (
          <span className="ml-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
            Screen
          </span>
        )}
      </div>

      {/* Pin button on hover */}
      {showControls && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => onPin(participant)}
            className={`p-1.5 rounded-md text-white text-xs transition ${
              isPinned ? "bg-blue-500" : "bg-black/60 hover:bg-black/80"
            }`}
            title={isPinned ? "Unpin" : "Pin"}
          >
            <Pin className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Speaking indicator */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-green-400 opacity-0 group-hover:opacity-0 pointer-events-none transition" />
    </div>
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
  localIdentity,
}) => {
  const [pinnedParticipant, setPinnedParticipant] = useState(null);
  const [showParticipantList, setShowParticipantList] = useState(false);

  const handlePin = (participant) => {
    setPinnedParticipant((prev) =>
      prev?.id === participant.id && prev?.isScreen === participant.isScreen
        ? null
        : participant,
    );
  };

  const orderedParticipants = pinnedParticipant
    ? [
        pinnedParticipant,
        ...participants.filter(
          (p) =>
            !(
              p.id === pinnedParticipant.id &&
              p.isScreen === pinnedParticipant.isScreen
            ),
        ),
      ]
    : participants;

  const hasPinned = !!pinnedParticipant;

  return (
    <div className="flex h-auto flex-col bg-gray-900 rounded-2xl overflow-hidden select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isJoined ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
          />
          <span className="text-white text-sm font-medium">
            {isJoined ? "Live" : "Waiting..."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParticipantList((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              showParticipantList
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{participants.length}</span>
          </button>

          <button
            onClick={onFullScreen}
            className="p-1.5 rounded-lg text-gray-300 hover:bg-white/10 transition"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {livekitError && (
        <div className="px-4 py-2 bg-red-500/20 border-b border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {livekitError}
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* Video grid */}
        <div className="flex-1 p-2 overflow-hidden">
          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <p className="text-sm">
                {livekitLoading
                  ? "Connecting..."
                  : "Waiting for participants to join"}
              </p>
            </div>
          ) : hasPinned ? (
            /* Pinned layout: large pinned + strip on right */
            <div className="flex gap-2 h-full">
              <div className="flex-1 min-w-0">
                <VideoTile
                  participant={orderedParticipants[0]}
                  index={0}
                  isPinned
                  onPin={handlePin}
                  isLocal={orderedParticipants[0]?.id === localIdentity}
                />
              </div>
              <div className="w-36 flex flex-col gap-2 overflow-y-auto">
                {orderedParticipants.slice(1).map((p, i) => (
                  <div
                    key={p.id + (p.isScreen ? "-s" : "") + i}
                    className="h-24 shrink-0"
                  >
                    <VideoTile
                      participant={p}
                      index={i + 1}
                      isPinned={false}
                      onPin={handlePin}
                      isLocal={p.id === localIdentity}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Grid layout */
            <div
              className={`grid gap-2 h-full ${getGridLayout(participants.length)}`}
            >
              {orderedParticipants.map((p, i) => (
                <VideoTile
                  key={p.id + (p.isScreen ? "-s" : "") + i}
                  participant={p}
                  index={i}
                  isPinned={false}
                  onPin={handlePin}
                  isLocal={p.id === localIdentity}
                />
              ))}
            </div>
          )}
        </div>

        {/* Participant sidebar */}
        {showParticipantList && (
          <div className="w-48 border-l border-white/10 bg-gray-900 flex flex-col overflow-hidden">
            <div className="px-3 py-2 text-xs font-medium text-gray-400 border-b border-white/10">
              Participants ({participants.length})
            </div>
            <div className="flex-1 overflow-y-auto">
              {participants.map((p, i) => (
                <div
                  key={p.id + i}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/5"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${COLORS[i % COLORS.length]}`}
                  >
                    {getInitials(p.id)}
                  </div>
                  <span className="text-white text-xs truncate flex-1">
                    {p.id === localIdentity ? `${p.id} (You)` : p.id}
                  </span>
                  {p.isScreen && (
                    <Monitor className="w-3 h-3 text-blue-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {isJoined && (
        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-900/90 backdrop-blur-sm border-t border-white/10">
          <button
            onClick={onToggleScreenShare}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-xs font-medium transition ${
              isScreenSharing
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-5 h-5" />
            ) : (
              <Monitor className="w-5 h-5" />
            )}
            {isScreenSharing ? "Stop Share" : "Share Screen"}
          </button>

          {onLeave && (
            <button
              onClick={onLeave}
              className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition"
            >
              <PhoneOff className="w-5 h-5" />
              {leaveButtonText || APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoContainer;

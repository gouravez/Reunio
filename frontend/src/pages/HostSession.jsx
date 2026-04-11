import { useState, useRef, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { useAuth } from "../context/AuthContext";
import { useLiveKit } from "../hooks/useLiveKit";
import { copyToClipboard } from "../utils/helpers";
import { API_ENDPOINTS, APP_CONFIG } from "../utils/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import toast from "react-hot-toast";
import api from "../services/api";
import { Loader } from "lucide-react";
import SessionHeader from "../components/Session/SessionHeader";
import SessionInfoCard from "../components/Session/SessionInfoCard";
import VideoContainer from "../components/Session/VideoContainer";
import ParticipantsList from "../components/Session/ParticipantsList";

const HostSession = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { currentSession, getSession, clearSession } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const liveKitJoinedRef = useRef(false);

  const roomId = searchParams.get("roomId") || currentSession?.roomId;
  const {
    isJoined,
    userHasJoined,
    error,
    loading,
    containerRef,
    joinLiveKitRoom,
    leaveLiveKitRoom,
    toggleScreenShare,
  } = useLiveKit();

  const handleFullScreen = () => {
    const videoContainer = containerRef.current;
    if (!videoContainer) return;

    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      videoContainer.requestFullscreen?.();
    }
  };

  // load session info
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      if (!roomId) {
        navigate(ROUTES.DASHBOARD);
        return;
      }

      setIsLoading(true);
      const result = await getSession(roomId);
      if (!isMounted) {
        return;
      }

      if (result.success) {
        setSessionInfo(result.session);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
      setIsLoading(false);
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [roomId, navigate, getSession]);

  useEffect(() => {
    if (!sessionInfo || !roomId || liveKitJoinedRef.current) return;

    let isMounted = true;
    let retryTimeout = null;

    const joinLiveKit = async () => {
      if (
        containerRef.current &&
        isMounted &&
        liveKitJoinedRef.current === false
      ) {
        liveKitJoinedRef.current = true;
        const liveKitResult = await joinLiveKitRoom(roomId);
        if (!isMounted) return;

        if (!liveKitResult.success) {
          console.error("Failed to join LiveKit room:", liveKitResult.error);
          liveKitJoinedRef.current = false;
        }
      } else if (isMounted && !containerRef.current) {
        retryTimeout = setTimeout(joinLiveKit, 200);
      }

      return () => {
        isMounted = false;
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }

        if (liveKitJoinedRef.current) {
          leaveLiveKitRoom();
          liveKitJoinedRef.current = false;
        }
      };
    };
    joinLiveKit();
  }, [sessionInfo, roomId]);

  // Poll participants every 5 seconds to update the list
  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      const result = await getSession(roomId);
      if (result.success && result.session) {
        setSessionInfo((prev) => {
          if (
            prev &&
            prev.participantCount === result.session.participantCount &&
            prev.status === result.session.status &&
            prev.participants.length === result.session.participants.length
          ) {
            return prev;
          }
          return result.session;
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [roomId, getSession]);

  const handleCopyRoomId = async () => {
    if (roomId) {
      const success = await copyToClipboard(roomId);
      if (success) {
        setCopiedRoomId(true);
        setTimeout(() => setCopiedRoomId(false), 2000);
      }
    }
  };

  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${ROUTES.JOIN}?roomId=${roomId}`;
  };

  const handleCopyLink = async () => {
    const link = getShareableLink();
    const success = await copyToClipboard(link);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleEndSession = async () => {
    if (!sessionInfo || !sessionInfo.isHost) return;

    try {
      if (liveKitJoinedRef.current) {
        await leaveLiveKitRoom();
        liveKitJoinedRef.current = false;
      }

      await api.post(`${API_ENDPOINTS.SESSION.END}/${sessionInfo.id}`);
      clearSession();
      toast.success("Session ended successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error("Failed to end session, Please try again");
      console.error("Error ending session:", error);
    }
  };

  const handleLeave = async () => {
    if (sessionInfo.isHost) {
      handleEndSession();
    } else {
      if (liveKitJoinedRef.current) {
        await leaveLiveKitRoom();
        liveKitJoinedRef.current = false;
      }

      await api.post(`${API_ENDPOINTS.SESSION.LEAVE}/${sessionInfo.roomId}`);
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            {APP_CONFIG.LOADING_MESSAGES.SESSION}
          </p>
        </div>
      </div>
    );
  }

  if (!sessionInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <SessionHeader
        title={APP_CONFIG.SESSION_CONTENT.HEADER.HOSTING_TITLE}
        roomId={roomId}
        username={user?.name}
        onBack={handleBack}
        showEndButton={sessionInfo.isHost}
        onEndSession={handleEndSession}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SessionInfoCard
              roomId={roomId}
              shareableLink={getShareableLink()}
              status={sessionInfo.status}
              participantCount={sessionInfo.participantCount}
              copiedRoomId={copiedRoomId}
              copiedLink={copiedLink}
              onCopyRoomId={handleCopyRoomId}
              onCopyLink={handleCopyLink}
            />

            <VideoContainer
              containerRef={containerRef}
              isJoined={isJoined}
              userHasJoined={userHasJoined}
              livekitError={error}
              livekitLoading={loading}
              onFullScreen={handleFullScreen}
              onLeave={handleLeave}
              leaveButtonText={
                sessionInfo.isHost
                  ? APP_CONFIG.SESSION_CONTENT.VIDEO.END_BUTTON
                  : APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON
              }
              onToggleScreenShare={toggleScreenShare}
            />
          </div>

          <div className="lg:col-span-1">
            <ParticipantsList
              participants={sessionInfo.participants}
              hostName={sessionInfo.hostName}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostSession;

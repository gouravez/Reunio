import { useCallback, useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";

export const useLiveKit = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [userHasJoined, setUserHasJoined] = useState(false);
  const [liveKitError, setLiveKitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const containerRef = useRef(null);
  const roomRef = useRef(null);
  const joinedRoomIdRef = useRef(null);
  const isJoiningRef = useRef(false);
  const isLeavingRef = useRef(false);

  const { user } = useAuth();
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };

  const joinLiveKitRoom = useCallback(
    async (roomId) => {
      if (joinedRoomIdRef.current === roomId && isJoined) {
        return { success: true };
      }

      if (isJoiningRef.current) {
        return { success: false, error: "Join room in process" };
      }

      if (!roomId) {
        const errorMessage = "Room Id is required";
        setLiveKitError(errorMessage);
        return { success: false, error: errorMessage };
      }

      isJoiningRef.current = true;
      setLoading(true);
      setLiveKitError(null);

      try {
        // wait for container (same as your zego logic)
        let retries = 0;
        const maxRetries = 30;

        while (!containerRef.current && retries < maxRetries) {
          await new Promise((res) => setTimeout(res, 100));
          retries++;
        }

        if (!containerRef.current) {
          throw new Error("Video container not ready. Refresh page.");
        }

        const container = containerRef.current;

        // get token from backend
        const res = await api.post(API_ENDPOINTS.SESSION.TOKEN, { roomId });
        const token = res.data.data.token;

        const room = new Room();
        roomRef.current = room;

        // connect
        await room.connect(import.meta.env.VITE_LIVEKIT_URL, token);

        // handle remote tracks
        room.on("trackSubscribed", (track, publication, participant) => {
          if (track.kind === "video" || track.kind === "audio") {
            const el = track.attach();

            if (publication.source === "screen_share") {
              el.style.width = "100%";
              el.style.height = "100%";
              el.style.objectFit = "contain";
            }
          }
        });

        room.on("localTrackUnpublished", (publication) => {
          if (publication.source === "screen_share") {
            setIsScreenSharing(false);
          }
        });

        // enable local media
        await room.localParticipant.enableCameraAndMicrophone();

        // attach local tracks
        room.localParticipant.videoTrackPublications.forEach((pub) => {
          const track = pub.track;
          if (track) {
            const el = track.attach();
            container.appendChild(el);
          }
        });

        setIsJoined(true);
        setUserHasJoined(true);
        joinedRoomIdRef.current = roomId;

        return { success: true };
      } catch (error) {
        console.error("Failed to join LiveKit room", error);

        const errorMessage =
          error.message || "Failed to join room. Check camera/mic permissions.";

        setLiveKitError(errorMessage);
        setIsJoined(false);
        setUserHasJoined(false);
        joinedRoomIdRef.current = null;

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        isJoiningRef.current = false;
      }
    },
    [user, isJoined],
  );

  const leaveLiveKitRoom = useCallback(async () => {
    if (isLeavingRef.current || !roomRef.current) return;

    isLeavingRef.current = true;

    try {
      roomRef.current.disconnect();

      // clean DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      setIsJoined(false);
      setUserHasJoined(false);
      joinedRoomIdRef.current = null;
      roomRef.current = null;
    } catch (error) {
      console.error("Error leaving room", error);
    } finally {
      isLeavingRef.current = false;
    }
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (!roomRef.current) return;

    try {
      if (!isScreenSharing) {
        await roomRef.current.localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      } else {
        await roomRef.current.localParticipant.setScreenShareEnabled(false);
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error("Screen share error", err);
      setLiveKitError("Failed to toggle screen share");
    }
  }, [isScreenSharing]);

  // cleanup (same as your zego hook)
  useEffect(() => {
    return () => {
      if (roomRef.current && !isLeavingRef.current) {
        try {
          roomRef.current.disconnect();
        } catch (error) {
          console.error("Cleanup error", error);
        }

        roomRef.current = null;
        joinedRoomIdRef.current = null;
        isJoiningRef.current = false;
        isLeavingRef.current = false;
      }
    };
  }, []);

  return {
    // state
    isJoined,
    userHasJoined,
    liveKitError,
    loading,
    containerRef,
    isScreenSharing,

    // methods
    joinLiveKitRoom,
    leaveLiveKitRoom,
    toggleScreenShare,
  };
};

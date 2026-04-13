import { useCallback, useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";

export const useLiveKit = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [userHasJoined, setUserHasJoined] = useState(false);
  const [liveKitError, setLiveKitError] = useState(null);
  const [liveKitLoading, setliveKitLoading] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);

  const containerRef = useRef(null);
  const roomRef = useRef(null);
  const joinedRoomIdRef = useRef(null);
  const isJoiningRef = useRef(false);
  const isLeavingRef = useRef(false);

  const { user } = useAuth();

  const addParticipant = (newParticipant) => {
    setParticipants((prev) => {
      const exists = prev.some(
        (p) => p.id === newParticipant.id && p.track === newParticipant.track,
      );
      if (exists) return prev;
      return [...prev, newParticipant];
    });
  };

  const seedExistingParticipants = (room) => {
    room.remoteParticipants.forEach((participant) => {
      participant.videoTrackPublications.forEach((publication) => {
        if (publication.isSubscribed && publication.track) {
          addParticipant({
            id: participant.identity,
            track: publication.track,
            isScreen: publication.source === "screen_share",
          });
        }

        publication.on("subscribed", (track) => {
          addParticipant({
            id: participant.identity,
            track,
            isScreen: publication.source === "screen_share",
          });
        });
      });

      participant.on("trackSubscribed", (track, publication) => {
        if (track.kind === "video") {
          addParticipant({
            id: participant.identity,
            track,
            isScreen: publication.source === "screen_share",
          });
        }
      });
    });
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
      setliveKitLoading(true);
      setLiveKitError(null);

      try {
        const res = await api.post(API_ENDPOINTS.SESSION.TOKEN, { roomId });
        const token = res.data.data.token;

        const room = new Room();
        roomRef.current = room;

        await room.connect(import.meta.env.VITE_LIVEKIT_URL, token);

        await room.localParticipant.enableCameraAndMicrophone();

        const localPubs = room.localParticipant?.videoTrackPublications;
        if (localPubs) {
          localPubs.forEach((pub) => {
            if (pub.track) {
              addParticipant({
                id: room.localParticipant.identity,
                track: pub.track,
                isScreen: false,
              });
            }

            pub.on("subscribed", (track) => {
              addParticipant({
                id: room.localParticipant.identity,
                track,
                isScreen: false,
              });
            });
          });
        }

        seedExistingParticipants(room);

        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track, publication) => {
            if (track.kind === "video") {
              addParticipant({
                id: participant.identity,
                track,
                isScreen: publication.source === "screen_share",
              });
            }
          });
        });

        room.on("trackUnsubscribed", (track) => {
          setParticipants((prev) => prev.filter((p) => p.track !== track));
        });

        room.on("localTrackUnpublished", (publication) => {
          if (publication.source === "screen_share") {
            setIsScreenSharing(false);
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
        setliveKitLoading(false);
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

      setParticipants([]);
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
    isJoined,
    userHasJoined,
    liveKitError,
    liveKitLoading,
    containerRef,
    isScreenSharing,
    participants,
    joinLiveKitRoom,
    leaveLiveKitRoom,
    toggleScreenShare,
  };
};
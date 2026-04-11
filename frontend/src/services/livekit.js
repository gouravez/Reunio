import { Room } from "livekit-client";
import api from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";

let roomInstance = null;
let userHasJoined = false;
let isDestroying = false;

const requestMediaPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error("Failed to get media permission", error);
    return false;
  }
};

export const joinRoom = async (
  roomId,
  userId,
  userName,
  container,
  onJoinCallback,
  onLeaveCallback
) => {
  if (!container) {
    throw new Error("Container element is required");
  }

  if (roomInstance && !isDestroying) {
    try {
      isDestroying = true;
      const instance = roomInstance;
      roomInstance = null;

      instance?.disconnect();
      userHasJoined = false;
    } catch (error) {
      console.error("Error cleaning up existing LiveKit instance", error);
    } finally {
      isDestroying = false;
    }
  }

  let hasPermission = false;
  try {
    hasPermission = await requestMediaPermission();
  } catch (error) {
    console.warn("Permission pre-request failed", error);
  }

  let token;
  try {
    const res = await api.post(API_ENDPOINTS.SESSION.TOKEN, { roomId });
    token = res.data.data.token;

    if (!token) throw new Error("Token is empty");
  } catch (error) {
    console.error("Token error", error);
    throw new Error(`Failed to get LiveKit token: ${error.message}`);
  }

  let room;
  try {
    room = new Room();
    if (!room) throw new Error("Failed to create room instance");
  } catch (error) {
    console.error("LiveKit instance creation error", error);
    throw new Error(`Failed to create LiveKit instance: ${error.message}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    await room.connect(import.meta.env.VITE_LIVEKIT_URL, token);

    userHasJoined = true;
    if (onJoinCallback) onJoinCallback();

    room.on("trackSubscribed", (track, publication, participant) => {
      const el = track.attach();
      container.appendChild(el);
    });

    if (hasPermission) {
      await room.localParticipant.enableCameraAndMicrophone();
    }

    room.localParticipant.videoTrackPublications.forEach((pub) => {
      const track = pub.track;
      if (track) {
        const el = track.attach();
        container.appendChild(el);
      }
    });

    room.on("disconnected", () => {
      userHasJoined = false;
      if (onLeaveCallback) onLeaveCallback();
    });
  } catch (error) {
    console.error("Error joining LiveKit room", error);

    room?.disconnect();
    roomInstance = null;
    userHasJoined = false;

    throw new Error(`Failed to join room ${error.message}`);
  }

  roomInstance = room;
  return room;
};

export const leaveRoom = (onLeaveCallback) => {
  if (!roomInstance || isDestroying) {
    if (onLeaveCallback) onLeaveCallback();
    return;
  }

  isDestroying = true;

  const instance = roomInstance;
  roomInstance = null;
  userHasJoined = false;

  if (onLeaveCallback) {
    try {
      onLeaveCallback();
    } catch (error) {
      console.error("Error in leave callback", error);
    }
  }

  try {
    instance?.disconnect();
  } catch (error) {
    console.error("Error leaving LiveKit room", error);
  } finally {
    isDestroying = false;
  }
};

export const getLiveKitInstance = () => {
  return roomInstance;
};

export const hasUserJoined = () => {
  return userHasJoined;
};
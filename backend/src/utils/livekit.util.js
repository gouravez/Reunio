import { AccessToken } from "livekit-server-sdk";

export const generateToken = (roomName, userName) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: userName },
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return at.toJwt();
};

const getLiveKitToken = async (roomId) => {
  const res = await fetch("/api/session/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId }),
  });

  return res.json();
};

export default getLiveKitToken;
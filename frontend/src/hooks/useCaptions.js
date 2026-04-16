// hooks/useCaptions.js
import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export const useCaptions = () => {
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    const handleCaption = ({ userId, text }) => {
      console.log("Captions", userId, text);
      setCaptions((prev) => {
        const last = prev[prev.length - 1];

        if (last?.text === text) return prev;

        const updated = [...prev, { userId, text }];
        return updated.slice(-20);
      });
    };
    socket.on("caption", handleCaption);

    return () => {
      socket.off("caption", handleCaption);
    };
  }, []);

  return captions;
};

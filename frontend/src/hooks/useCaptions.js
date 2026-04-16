import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";

export const useCaptions = () => {
  const [captions, setCaptions] = useState([]);
  const interimMap = useRef(new Map());

  useEffect(() => {
    const handleCaption = ({ userId, text, isFinal }) => {
      setCaptions((prev) => {
        let updated = [...prev];

        if (isFinal) {
          interimMap.current.delete(userId);

          const lastIndex = updated.findIndex(
            (c) => c.userId === userId && !c.final
          );

          if (lastIndex !== -1) {
            updated[lastIndex] = {
              userId,
              text,
              final: true,
            };
          } else {
            updated.push({
              userId,
              text,
              final: true,
            });
          }
        } else {
          interimMap.current.set(userId, text);
        }

        const merged = [
          ...updated.filter((c) => c.final),
          ...Array.from(interimMap.current.entries()).map(
            ([userId, text]) => ({
              userId,
              text,
              final: false,
            })
          ),
        ];

        return merged.slice(-10);
      });
    };

    socket.on("caption", handleCaption);
    return () => socket.off("caption", handleCaption);
  }, []);

  return captions;
};
"use client";

import { useEffect, useState } from "react";

const TypingLoader = ({ text = "Loading...", speed = 150 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText(() => text.slice(0, index + 1));
      setIndex((prev) => (prev + 1) % (text.length + 1));
    }, speed);

    return () => clearInterval(interval);
  }, [text, index, speed]);

  return (
    <span className="text-lg font-mono text-gray-700 w-full h-full flex items-center justify-center">
      {displayedText}
    </span>
  );
};

export default TypingLoader;

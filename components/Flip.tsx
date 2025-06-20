import React, { useEffect, useState } from "react";

export function FlipWordsDemo() {
  const words = ["better", "Sustainable", "beautiful", "Green"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="h-[4rem] flex justify-center items-center px-2">
      <div className="text-7xl font-Roboto text-white font-bold">
        Build
        <span className="text-emerald-500 px-2 transition-colors duration-500">{words[index]}</span>
        Future with us !
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroAnimation({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visited = sessionStorage.getItem("contrail-visited");
    if (visited === "true") {
      onComplete();
      return;
    }

    sessionStorage.setItem("contrail-visited", "true");

    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => setPhase(4), 2500);
    const t5 = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      id="loading"
      style={{
        opacity: phase >= 4 ? 0 : 1,
        pointerEvents: phase >= 4 ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      <div className="relative mx-auto flex w-[640px] max-w-[85vw] flex-col items-center justify-center sm:max-w-[90vw]">
        <img
          className="logo-line"
          src="/assets/images/contrail-line.png"
          alt=""
          style={{
            opacity: phase >= 2 ? 1 : 0,
            clipPath: phase >= 2 ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
        />
        <img
          className="logo-main"
          src="/assets/images/contrail-main.png"
          alt="Contrail"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(0.92)",
          }}
        />
        <img
          className="logo-dot"
          src="/assets/images/contrail-dot.png"
          alt=""
          style={{
            opacity: phase >= 3 ? 1 : 0,
            top: phase >= 3 ? "0px" : "-40px",
          }}
        />
      </div>
    </div>
  );
}

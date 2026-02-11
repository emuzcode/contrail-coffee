"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:px-6"
    >
      {/* Subtle contrail canvas background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute left-0 top-0 h-full w-full opacity-[0.04]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M-100,400 Q200,200 500,350 T1100,300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M-50,500 Q300,350 600,420 T1300,380"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        {/* Logo */}
        <div className="mb-16 w-full max-w-md sm:mb-20 md:max-w-lg">
          <img
            src="/assets/images/contrail-logo-transparent.png"
            alt="Contrail Coffee & Chocolate"
            className="w-full"
          />
        </div>

        {/* Main copy */}
        <div className="text-center">
          <p className="mb-4 font-serif text-lg leading-relaxed tracking-wide text-foreground/80 sm:text-xl md:text-2xl">
            {"かつては空の旅を。"}
            <br />
            {"これからは、あなたの日常の出発を。"}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {"今日という旅が、どうか良い一日になりますように。"}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator mt-20 sm:mt-24">
          <svg
            width="20"
            height="32"
            viewBox="0 0 20 32"
            fill="none"
            className="text-muted-foreground/40"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="18"
              height="30"
              rx="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="10" r="2" fill="currentColor">
              <animate
                attributeName="cy"
                values="10;20;10"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}

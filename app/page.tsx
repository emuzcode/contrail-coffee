"use client";

import { useState, useCallback, useEffect } from "react";
import IntroAnimation from "@/components/intro-animation";
import HeroSection from "@/components/hero-section";
import ConceptSection from "@/components/concept-section";
import MenuSection from "@/components/menu-section";
import NewsSection from "@/components/news-section";
import CalendarSection from "@/components/calendar-section";
import AccessSection from "@/components/access-section";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("[v0] Home mounted");
  }, []);

  const handleIntroComplete = useCallback(() => {
    console.log("[v0] Intro complete called");
    setIntroComplete(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}
      <main
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <HeroSection />
        <ConceptSection />
        <MenuSection />
        <NewsSection />
        <CalendarSection />
        <AccessSection />
        <SiteFooter />
      </main>
    </>
  );
}

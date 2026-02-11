"use client";

import { useState, useCallback } from "react";
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


  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

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

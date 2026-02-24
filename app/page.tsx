"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/hero";
import About from "@/components/about";
import ResearchFocus from "@/components/researchfocus";
import ResearchThemes from "@/components/researchtheme";
import Collaborator from "@/components/collaborator";
import Activities from "@/components/activities";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";

function HomeContent() {
  const searchParams = useSearchParams();
  const [hasScrolled, setHasScrolled] = useState(false);
  const section = searchParams.get("section");

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (scrollTo && !hasScrolled) {
      // Multiple retries to ensure element exists
      const scrollAttempt = (attempt = 0) => {
        const target = document.getElementById(scrollTo);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            setHasScrolled(true);
          }, 100);
        } else if (attempt < 10) {
          // Element not found yet, retry after delay
          setTimeout(() => scrollAttempt(attempt + 1), 100);
        }
      };

      // Start scrolling attempt immediately
      scrollAttempt();
    }
  }, [searchParams, hasScrolled]);

  // If section parameter is set, render only that section
  if (section === "contact") {
    return (
      <div>
        <Contact />
      </div>
    );
  }

  // Default: render all sections
  return (
    <div>
      <Hero />
      <Activities />
      <About />
      <ResearchThemes />
      <ResearchFocus />
      <Collaborator />

      <Gallery />
      <Contact />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}> 
      <HomeContent />
    </Suspense>
  );
}

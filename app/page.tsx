"use client";

import Hero from "@/components/hero";
import About from "@/components/about";
import ResearchThemes from "@/components/researchtheme";
import ResearchFocus from "@/components/researchfocus";
import Projects from "@/components/project";
import OurTeam from "@/components/ourteam";
import Activities from "@/components/activities";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <ResearchThemes />
      <ResearchFocus />
      <Projects />
      <OurTeam />
      <Activities />
    </div>
  );
}

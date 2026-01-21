"use client";

import Hero from "@/components/hero";
import About from "@/components/about";
import ResearchFocus from "@/components/researchfocus";
import ResearchThemes from "@/components/researchtheme";
import OurTeam from "@/components/ourteam";
import Collaborator from "@/components/collaborator";
import Activities from "@/components/activities";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <Activities />
      <About />
      <ResearchThemes />
      <ResearchFocus />
      <OurTeam />
      <Collaborator />

      <Gallery />
      <Contact />
    </div>
  );
}

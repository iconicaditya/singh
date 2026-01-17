"use client";

import Hero from "@/components/hero";
import About from "@/components/about";
import ResearchThemes from "@/components/researchtheme";
import ResearchFocus from "@/components/researchfocus";
import ProjectsPreview from "@/components/projects/ProjectsPreview";
import PublicationsSection from "@/components/publications/PublicationsSection";
import OurTeam from "@/components/ourteam";
import Activities from "@/components/activities";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <ResearchThemes />
      <ResearchFocus />
      <ProjectsPreview />
      <PublicationsSection />
      <OurTeam />
      <Gallery />
      <Activities />
      <Contact />
    </div>
  );
}

"use client";

import Hero from "@/components/hero";
import About from "@/components/about";
import ResearchFocus from "@/components/researchfocus";
import ResearchThemes from "@/components/researchtheme";
import ProjectsPreview from "@/components/projects/ProjectsPreview";
import PublicationsSection from "@/components/publications/PublicationsSection";
import OurTeam from "@/components/ourteam";
import Collaborator from "@/components/collaborator";
import Activities from "@/components/activities";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <ResearchFocus />
      <ResearchThemes />
      <ProjectsPreview />
      <PublicationsSection />
      <OurTeam />
      <Collaborator />
      <Gallery />
      <Activities />
      <Contact />
    </div>
  );
}

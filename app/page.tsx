import Hero from "@/components/hero";
import About from "@/components/about";
import ResearchThemes from "@/components/researchtheme";
import ResearchFocus from "@/components/researchfocus";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <ResearchThemes />
      <ResearchFocus />
    </div>
  );
}

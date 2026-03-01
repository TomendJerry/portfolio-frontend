// Frontend/app/page.tsx
import { Hero } from "../components/Hero";
import { Navigation } from "../components/Navigation";
import { FocusAreas } from "../components/FocusAreas";
import { TechStack } from "../components/TechStack";
import { FeaturedProjects } from "../components/FeaturedProjects";
import { About } from '@/components/About';
import { Contact } from "../components/Contact";
import { RatingSystem } from "@/components/RatingSystem";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1117]">
      <Navigation />
      <Hero />
      <div className="container mx-auto px-6">
        <About />
        <TechStack />
        <FocusAreas />
        <FeaturedProjects />
        <Contact />
        <RatingSystem />
      </div>
    </main>
  );
}
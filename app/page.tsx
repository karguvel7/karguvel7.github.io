import { About } from "@/components/about";
import { ArchitectureStack } from "@/components/architecture-stack";
import { BuildingWithAI } from "@/components/building-with-ai";
import { Contact } from "@/components/contact";
import { EngineeringLab } from "@/components/engineering-lab";
import { Experience } from "@/components/experience";
import { GithubLab } from "@/components/github-lab";
import { Hero } from "@/components/hero";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkillsEcosystem } from "@/components/skills-ecosystem";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell min-w-0 overflow-x-clip">
        <Hero />
        <About />
        <SkillsEcosystem />
        <BuildingWithAI />
        <ArchitectureStack />
        <ProjectGallery />
        <Experience />
        <EngineeringLab />
        <GithubLab />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

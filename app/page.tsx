import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";
import { Expertise } from "@/components/expertise";
import { GithubSection } from "@/components/github-section";
import { Hero } from "@/components/hero";
import { Platform } from "@/components/platform";
import { Projects } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Stack } from "@/components/stack";
import { Systems } from "@/components/systems";
import { Workflow } from "@/components/workflow";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Expertise />
        <Systems />
        <Platform />
        <Projects />
        <Stack />
        <Workflow />
        <GithubSection />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

"use client";

import type { Resume } from "@/data/resume";
import { Cursor } from "@/components/Cursor";
import { Preloader } from "@/components/Preloader";
import { SideNav } from "@/components/SideNav";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { WorksSection } from "@/components/sections/WorksSection";
import { WorldHUD } from "@/components/WorldHUD";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useScrollChoreography } from "@/hooks/use-scroll-choreography";

interface PortfolioShellProps {
  resume: Resume;
}

export function PortfolioShell({ resume }: PortfolioShellProps) {
  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress();

  useScrollChoreography(reducedMotion);

  const scrollToWorks = () => {
    document.getElementById("works")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="site-shell">
      <Preloader />
      <Cursor />
      <WorldHUD progress={scrollProgress} />
      <SideNav reducedMotion={reducedMotion} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <main id="main-content">
        <HeroSection
          resume={resume}
          reducedMotion={reducedMotion}
          scrollProgress={scrollProgress}
          onExplore={scrollToWorks}
        />
        <AboutSection resume={resume} />
        <WorksSection resume={resume} />
        <SkillsSection resume={resume} />
        <JourneySection resume={resume} />
        <VisionSection resume={resume} />
        <ContactSection resume={resume} />
      </main>
      <SiteFooter resume={resume} />
    </div>
  );
}

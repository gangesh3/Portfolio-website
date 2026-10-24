"use client";

import type { Resume } from "@/data/resume";
import { isTodoPlaceholder } from "@/lib/resume-utils";
import { SignalGardenFallback, SceneClient } from "@/components/scene/SceneClient";

interface HeroSectionProps {
  resume: Resume;
  reducedMotion: boolean;
  scrollProgress: number;
  onExplore: () => void;
}

export function HeroSection({ resume, reducedMotion, scrollProgress, onExplore }: HeroSectionProps) {
  const photoUnavailable = isTodoPlaceholder(resume.links.photoUrl);

  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title" data-cinematic-section="TOP">
      <div className="hero-section__scene" aria-hidden="true">
        <SceneClient reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
      </div>
      <div className="hero-section__grid" aria-hidden="true" data-cinematic-float />
      <div className="section-shell hero-section__inner">
        <div className="hero-section__copy" data-reveal>
          <p className="eyebrow">Signal Garden / Portfolio</p>
          <p className="hero-section__name">{resume.name}</p>
          <h1 id="hero-title" className="display-title" data-cinematic-title>
            {resume.headline}
          </h1>
          <p className="hero-section__profile" data-cinematic-copy>
            {resume.profile}
          </p>
          <div className="hero-section__actions">
            <button className="button button--primary" type="button" onClick={onExplore} data-cursor>
              Explore selected work
              <span aria-hidden="true">↘</span>
            </button>
            <span className="hero-section__location">
              <span className="status-dot" aria-hidden="true" />
              {resume.location}
            </span>
          </div>
        </div>

        <aside className="hero-section__signal" aria-label="Profile portrait" data-reveal data-cinematic-float>
          <div className={`photo-placeholder ${photoUnavailable ? "is-unavailable" : ""}`}>
            {photoUnavailable ? (
              <>
                <span className="photo-placeholder__orb" aria-hidden="true" />
                <span className="eyebrow">Profile photo</span>
                <strong>Unavailable</strong>
                <small>{resume.links.photoUrl}</small>
              </>
            ) : (
              <div
                className="photo-placeholder__image"
                style={{ backgroundImage: `url(${resume.links.photoUrl})` }}
                role="img"
                aria-label={`${resume.name} profile photo`}
              />
            )}
          </div>
          <div className="hero-section__signal-caption">
            <span className="font-mono">01 / 07</span>
            <span>Start at the signal</span>
          </div>
        </aside>
      </div>
      <div className="hero-section__scroll-hint" aria-hidden="true">
        <span>Scroll to explore</span>
        <span className="hero-section__scroll-line" />
      </div>
      <noscript>
        <SignalGardenFallback />
      </noscript>
    </section>
  );
}

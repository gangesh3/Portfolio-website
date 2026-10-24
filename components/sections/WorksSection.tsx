"use client";

import { useState } from "react";
import type { Project, Resume } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectModal } from "@/components/ProjectModal";
import { hasProjectLink, isTodoPlaceholder } from "@/lib/resume-utils";

interface WorksSectionProps {
  resume: Resume;
}

export function WorksSection({ resume }: WorksSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="works" className="section section--works" aria-labelledby="works-title" data-cinematic-section="WORKS">
      <div className="section-shell">
        <SectionHeading
          index="03"
          eyebrow="Works"
          title="Selected builds with a practical signal."
          titleId="works-title"
          description="Open a project to inspect its contribution, stack, and available project link."
        />

        <div className="works-grid" data-stagger-group>
          {resume.projects.map((project, index) => {
            const photoUnavailable = isTodoPlaceholder(project.photoUrl);
            const linkAvailable = hasProjectLink(project);

            return (
              <button
                className="work-card"
                type="button"
                key={project.id}
                onClick={() => setSelectedProject(project)}
                data-reveal
                data-cursor
              >
                <div className="work-card__media">
                  <span className="work-card__number font-mono">0{index + 1}</span>
                  {photoUnavailable ? (
                    <div className="work-card__unavailable">
                      <span className="work-card__signal" aria-hidden="true" />
                      <span>Project image unavailable</span>
                    </div>
                  ) : (
                    <div
                      className="work-card__image"
                      style={{ backgroundImage: `url(${project.photoUrl})` }}
                      role="img"
                      aria-label={`${project.title} project image`}
                    />
                  )}
                  <span className="work-card__open" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="work-card__body">
                  <span className="eyebrow">{project.eyebrow}</span>
                  <h3>{project.title}</h3>
                  <p>{project.impact}</p>
                  <div className="work-card__footer">
                    <span>{linkAvailable ? "Project link available" : "Project link unavailable"}</span>
                    <span className="font-mono">View details</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}

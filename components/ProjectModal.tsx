"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/resume";
import { hasProjectLink, isTodoPlaceholder } from "@/lib/resume-utils";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) {
      return undefined;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose, project]);

  if (!project) {
    return null;
  }

  const photoUnavailable = isTodoPlaceholder(project.photoUrl);
  const linkAvailable = hasProjectLink(project);

  return (
    <div className="project-modal__backdrop" role="presentation">
      <div
        ref={dialogRef}
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
      >
        <button className="project-modal__close" type="button" onClick={onClose} aria-label="Close project details" data-cursor>
          ×
        </button>
        <div className="project-modal__media">
          {photoUnavailable ? (
            <div className="work-card__unavailable">
              <span className="work-card__signal" aria-hidden="true" />
              <span>Project image unavailable</span>
              <small>{project.photoUrl}</small>
            </div>
          ) : (
            <div
              className="work-card__image"
              style={{ backgroundImage: `url(${project.photoUrl})` }}
              role="img"
              aria-label={`${project.title} project image`}
            />
          )}
        </div>
        <div className="project-modal__content">
          <span className="eyebrow">{project.eyebrow}</span>
          <h2 id="project-modal-title">{project.title}</h2>
          <p className="body-large">{project.description}</p>
          <div className="project-modal__columns">
            <div>
              <span className="eyebrow">Stack</span>
              <div className="tag-list">
                {project.stack.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="eyebrow">Metrics</span>
              {project.metrics.length > 0 ? (
                <div className="tag-list">
                  {project.metrics.map((metric) => (
                    <span className="tag tag--lime" key={metric}>
                      {metric}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="muted-text">No metrics supplied</span>
              )}
            </div>
          </div>
          {project.notes.length > 0 ? (
            <ul className="detail-list project-modal__notes">
              {project.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
          <div className="project-modal__link">
            {linkAvailable ? (
              <a className="button button--primary" href={project.linkUrl} target="_blank" rel="noreferrer" data-cursor>
                Open project link <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="button button--disabled" aria-disabled="true">
                Project link unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

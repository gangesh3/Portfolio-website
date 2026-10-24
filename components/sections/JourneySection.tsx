import type { Resume } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

interface JourneySectionProps {
  resume: Resume;
}

export function JourneySection({ resume }: JourneySectionProps) {
  return (
    <section id="journey" className="section section--journey" aria-labelledby="journey-title" data-cinematic-section="JOURNEY">
      <div className="section-shell">
        <SectionHeading index="05" eyebrow="Journey" title="Milestones, teams, and the work between them." titleId="journey-title" />
        <div className="journey-layout">
          <div className="timeline" data-reveal data-cinematic-float data-stagger-group>
            {resume.journeyMilestones.map((milestone, index) => (
              <article className="timeline-item" key={`${milestone.period}-${milestone.title}`}>
                <div className="timeline-item__marker" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="timeline-item__content">
                  <span className="font-mono timeline-item__period">{milestone.period}</span>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="leadership-panel" data-reveal>
            <div className="subsection-label">
              <span className="section-index">D</span>
              <span>Leadership & campus experience</span>
            </div>
            <div className="leadership-list" data-stagger-group>
              {resume.leadership.map((entry) => (
                <article className="leadership-item" key={`${entry.role}-${entry.organization}`}>
                  <span className="font-mono">{entry.period}</span>
                  <h3>{entry.role}</h3>
                  <p className="muted-text">{entry.organization}</p>
                  <p>{entry.description}</p>
                  {entry.metrics.length > 0 ? (
                    <div className="tag-list">
                      {entry.metrics.map((metric) => (
                        <span className="tag tag--cyan" key={metric}>
                          {metric}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

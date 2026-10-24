import type { Resume } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

interface AboutSectionProps {
  resume: Resume;
}

export function AboutSection({ resume }: AboutSectionProps) {
  return (
    <section id="about" className="section section--about" aria-labelledby="about-title" data-cinematic-section="ABOUT">
      <div className="section-shell">
        <SectionHeading index="02" eyebrow="About" title="Profile, education, and systems in motion." titleId="about-title" />
        <div className="about-layout">
          <div className="about-profile" data-reveal data-cinematic-float>
            <p className="body-large">{resume.profile}</p>
            <div className="about-rule" />
            <p className="eyebrow">Current focus</p>
            <p className="about-focus">{resume.headline}</p>
          </div>

          <div className="about-education" data-reveal>
            <div className="subsection-label">
              <span className="section-index">A</span>
              <span>Education</span>
            </div>
            <div className="education-list" data-stagger-group>
              {resume.education.map((entry) => (
                <article className="education-item" key={`${entry.institution}-${entry.period}`}>
                  <div>
                    <h3>{entry.institution}</h3>
                    {entry.location ? <p className="muted-text">{entry.location}</p> : null}
                  </div>
                  <span className="font-mono education-item__period">{entry.period}</span>
                  <p>{entry.credential}</p>
                  <ul className="detail-list">
                    {entry.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="about-automation" data-reveal>
          <div className="subsection-label">
            <span className="section-index">B</span>
            <span>Automation highlights</span>
          </div>
          <div className="automation-grid" data-stagger-group>
            {resume.automationHighlights.map((highlight, index) => (
              <article className="automation-card" key={highlight.id}>
                <span className="automation-card__index font-mono">0{index + 1}</span>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
                <div className="tag-list" aria-label={`${highlight.title} stack`}>
                  {highlight.stack.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                {highlight.notes.length > 0 ? (
                  <ul className="detail-list">
                    {highlight.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

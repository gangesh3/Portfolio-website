import type { Resume } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

interface SkillsSectionProps {
  resume: Resume;
}

export function SkillsSection({ resume }: SkillsSectionProps) {
  return (
    <section id="skills" className="section section--skills" aria-labelledby="skills-title" data-cinematic-section="SKILLS">
      <div className="section-shell">
        <SectionHeading index="04" eyebrow="Skills" title="A toolkit across code, automation, and AI/ML." titleId="skills-title" />
        <div className="skills-layout">
          <div className="skills-grid" data-reveal data-cinematic-float data-stagger-group>
            {resume.skills.map((group, index) => (
              <article className="skill-group" key={group.category}>
                <div className="skill-group__heading">
                  <span className="section-index">0{index + 1}</span>
                  <h3>{group.category}</h3>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <aside className="certification-panel" data-reveal>
            <div className="subsection-label">
              <span className="section-index">C</span>
              <span>Certifications & training</span>
            </div>
            <ul className="certification-list">
              {resume.certifications.map((certification) => (
                <li key={`${certification.title}-${certification.issuer}`}>
                  <span className="certification-list__dot" aria-hidden="true" />
                  <div>
                    <strong>{certification.title}</strong>
                    <span>{certification.issuer}</span>
                    {certification.date ? <span className="font-mono">{certification.date}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
            <div className="achievement-panel">
              <span className="eyebrow">Achievement</span>
              {resume.achievements.map((achievement) => (
                <div key={achievement.title}>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  <div className="tag-list">
                    {achievement.metrics.map((metric) => (
                      <span className="tag tag--lime" key={metric}>
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

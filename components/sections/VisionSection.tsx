import type { Resume } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";

interface VisionSectionProps {
  resume: Resume;
}

export function VisionSection({ resume }: VisionSectionProps) {
  return (
    <section id="vision" className="section section--vision" aria-labelledby="vision-title" data-cinematic-section="VISION">
      <div className="section-shell">
        <SectionHeading index="06" eyebrow="Vision" title={resume.headline} titleId="vision-title" description={resume.profile} />
        <div className="vision-layout">
          <div className="vision-statement" data-reveal data-cinematic-float>
            <span className="vision-statement__quote" aria-hidden="true">
              “
            </span>
            <p>{resume.contactCopy.body}</p>
            <span className="vision-statement__rule" aria-hidden="true" />
          </div>

          <div className="vision-signals" data-reveal data-stagger-group>
            {resume.automationHighlights.map((highlight, index) => (
              <div className="vision-signal" key={highlight.id}>
                <span className="vision-signal__number font-mono">0{index + 1}</span>
                <div>
                  <span className="eyebrow">Automation</span>
                  <h3>{highlight.title}</h3>
                </div>
              </div>
            ))}
            {resume.projects.map((project, index) => (
              <div className="vision-signal" key={project.id}>
                <span className="vision-signal__number font-mono">0{index + 3}</span>
                <div>
                  <span className="eyebrow">Project</span>
                  <h3>{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

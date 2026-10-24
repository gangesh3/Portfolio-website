import type { Resume } from "@/data/resume";
import { SectionHeading } from "@/components/SectionHeading";
import { isAvailableUrl } from "@/lib/resume-utils";

interface ContactSectionProps {
  resume: Resume;
}

export function ContactSection({ resume }: ContactSectionProps) {
  const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const formAction = formspreeEndpoint || `mailto:${resume.email}`;
  const socialLinks = [
    { label: "LinkedIn", url: resume.links.linkedinUrl },
    { label: "GitHub", url: resume.links.githubUrl },
  ];

  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-title" data-cinematic-section="CONTACT">
      <div className="section-shell">
        <SectionHeading index="07" eyebrow="Contact" title={resume.contactCopy.heading} titleId="contact-title" description={resume.contactCopy.body} />
        <div className="contact-layout">
          <div className="contact-forms">
            <div className="contact-cta" data-reveal>
              <div className="contact-cta__actions">
                <a className="button button--primary button--large" href={`mailto:${resume.email}`} data-cursor>
                  {resume.contactCopy.cta}
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="button button--ghost button--large" href="/resume.pdf" download="Gangesh-Gupta-Resume.pdf" data-cursor>
                  Download resume
                  <span aria-hidden="true">↓</span>
                </a>
                <a className="button button--ghost button--large" href={resume.contactFormUrl} target="_blank" rel="noreferrer" data-cursor>
                  Open contact form
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="contact-availability">Direct email and a structured Google Form are available for new project conversations.</p>
            </div>

            <div className="contact-form-panel" data-reveal>
              <div className="subsection-label">
                <span className="section-index">FORM</span>
                <span>Send a signal</span>
              </div>
              <form className="contact-form" action={formAction} method="post" encType={formspreeEndpoint ? undefined : "text/plain"}>
                <div className="contact-form__grid">
                  <label className="form-field">
                    <span>Name</span>
                    <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
                  </label>
                  <label className="form-field">
                    <span>Email</span>
                    <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                  </label>
                </div>
                <label className="form-field">
                  <span>Message</span>
                  <textarea name="message" rows={5} placeholder="What are you building?" required />
                </label>
                <div className="contact-form__actions">
                  <button className="button button--primary" type="submit" data-cursor>
                    Send signal
                    <span aria-hidden="true">↗</span>
                  </button>
                  <p className="form-note">
                    {formspreeEndpoint
                      ? "Powered by the configured Formspree endpoint."
                      : "Fallback mode opens your email client. The Google Form is also available above for structured submissions."}
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="contact-details" data-reveal data-stagger-group>
            <div className="contact-detail">
              <span className="eyebrow">Email</span>
              <a href={`mailto:${resume.email}`} data-cursor>
                {resume.email}
              </a>
            </div>
            <div className="contact-detail">
              <span className="eyebrow">Phone</span>
              <a href={`tel:${resume.phone.replace(/[^\d+]/g, "")}`} data-cursor>
                {resume.phone}
              </a>
            </div>
            <div className="contact-detail">
              <span className="eyebrow">Location</span>
              <span>{resume.location}</span>
            </div>
            <div className="contact-detail">
              <span className="eyebrow">Social links</span>
              <div className="social-links">
                {socialLinks.map((link) =>
                  isAvailableUrl(link.url) ? (
                    <a href={link.url} target="_blank" rel="noreferrer" key={link.label} data-cursor>
                      {link.label}
                    </a>
                  ) : (
                    <span className="social-links__unavailable" key={link.label}>
                      {link.label}: unavailable
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

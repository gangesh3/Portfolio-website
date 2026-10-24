import type { Resume } from "@/data/resume";

interface SiteFooterProps {
  resume: Resume;
}

export function SiteFooter({ resume }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="section-shell site-footer__inner">
        <div>
          <p className="site-footer__name">{resume.name}</p>
          <p className="muted-text">{resume.headline}</p>
        </div>
        <div className="site-footer__meta">
          <span>{resume.location}</span>
          <a href="#top" data-cursor>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

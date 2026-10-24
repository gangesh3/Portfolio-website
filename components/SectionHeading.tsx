interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  titleId?: string;
  description?: string;
}

export function SectionHeading({ index, eyebrow, title, titleId, description }: SectionHeadingProps) {
  return (
    <div className="section-heading" data-reveal>
      <div className="section-heading__meta" data-cinematic-float>
        <span className="section-index">{index}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="section-title" id={titleId} data-cinematic-title>
        {title}
      </h2>
      {description ? (
        <p className="section-heading__description" data-cinematic-copy>
          {description}
        </p>
      ) : null}
    </div>
  );
}

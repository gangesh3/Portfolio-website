# Content map

| Resume data | Portfolio section |
| --- | --- |
| `name`, `headline`, `location`, `links` | Hero, navigation, and social/contact links |
| `profile` | About/profile section |
| `education` | Education section |
| `automationHighlights` | Workflow automation and AI-agent feature section |
| `projects` | Selected projects grid or case-study section |
| `leadership` | Leadership and campus experience section |
| `certifications` | Certifications and training section |
| `skills` | Skills grouped by category |
| `achievements` | Highlights or achievements section |
| `journeyMilestones` | Timeline/journey section |
| `contactCopy`, `contactFormUrl`, `email`, `phone` | Contact section and CTA |

## Assumptions and TODOs

- LinkedIn, GitHub, project links, a profile photo, project images, and a Google Form URL are now supplied in `data/resume.ts`.
- The separate Portfolio social-link option was removed because this site is the portfolio.
- Bullets were tightened for scanability while preserving the supported metrics and dates only: 30%, 7.71/10, 83%, 92.8%, runner-up/second place, and the listed periods.
- `journeyMilestones` is a chronological presentation of the dated education, leadership, certification, and achievement entries already present in the resume.

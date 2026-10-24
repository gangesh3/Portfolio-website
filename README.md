# Signal Garden Portfolio

An immersive, data-driven resume portfolio for **Gangesh Gupta**, built with the Next.js App Router. The interface uses a graphite canvas, electric violet signal geometry, acid-lime accents, and cyan data lines while keeping the resume object as the source of portfolio facts.

## Requirements

- Node.js 20+
- npm 10+

Dependencies are declared in `package.json` and locked in `package-lock.json`.

## Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks and production build

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Deploy

The project can deploy to any Next.js-compatible host. For a static production URL, set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

The value is used by `app/sitemap.ts`, `app/robots.ts`, and the metadata base URL. The generic sitemap fallback is `https://example.com` until the environment variable is supplied.

For hosted contact submissions, add a Formspree endpoint before deploying:

```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

Without that variable, the contact form falls back to the visitor's configured email client using the email in `data/resume.ts`.

## Customization

- Edit `data/resume.ts` to update portfolio facts. `CONTENT-MAP.md` documents where each field appears.
- Keep `TODO:` URL and photo placeholders only when a real asset is not available. Supplied profile and project assets live in `public/images` and are wired through `data/resume.ts`.
- The contact CTA includes the supplied Google Form URL; the separate Portfolio social-link option is intentionally omitted because this site is the portfolio.
- Adjust palette and spacing tokens in `app/globals.css`.
- Typography uses a reference-inspired Noto Sans JP gothic stack, Space Grotesk display type, and IBM Plex Mono metadata; tune the font import and variables at the top of `app/globals.css`.
- Replace the generated scene in `components/scene/SignalGardenCanvas.tsx` if the visual direction changes.
- The scene camera follows a Catmull-Rom path driven by global scroll progress; tune the path points and postprocessing in `components/scene/SignalGardenCanvas.tsx`.
- Tune the cinematic camera accents in the `CAMERA_BEATS` table in `components/scene/SignalGardenCanvas.tsx`.
- Add `data-cinematic-title`, `data-cinematic-copy`, or `data-cinematic-float` to new content when extending the scroll choreography.
- Add `data-stagger-group` to a repeated-content container to give its direct children a staged reveal.
- Update the hosted form target with `NEXT_PUBLIC_FORMSPREE_ENDPOINT`, or keep the mail client fallback.
- Update SEO structure in `app/layout.tsx`; JSON-LD is generated from the imported `resume` object.

## Included behavior

- Client-only React Three Fiber signal garden with a CSS fallback for reduced motion.
- Deep scroll-driven camera travel through procedural portal zones, orbiting nodes, star fields, and a shader-driven signal core.
- Scroll depth HUD with live world progress, chapter labels, and Bloom, Noise, and Vignette postprocessing.
- Lenis smooth scrolling and GSAP ScrollTrigger cinematic choreography with scrubbed title/copy reveals, section glows, parallax floats, and chapter state updates; disabled for reduced-motion users.
- Repeated content groups use staggered card, timeline, signal, and contact-detail reveals to keep dense sections readable while scrolling.
- Section-specific camera beats add subtle lift, focus, roll, and field-of-view changes as the scroll moves through the Signal Garden.
- Sound-free by default: no audio gate, audio context, or mute control is shipped.
- Responsive side navigation, keyboard-friendly controls, custom cursor on fine pointers, accessible modal project details, skip link, semantic section landmarks, downloadable resume, and a Formspree/mailto contact form.
- App Router metadata, sitemap, robots route, favicon, and Person JSON-LD.

## File tree

```text
.
├── app
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components
│   ├── Cursor.tsx
│   ├── PortfolioShell.tsx
│   ├── Preloader.tsx
│   ├── ProjectModal.tsx
│   ├── SectionHeading.tsx
│   ├── SideNav.tsx
│   ├── WorldHUD.tsx
│   ├── scene
│   │   ├── SceneClient.tsx
│   │   └── SignalGardenCanvas.tsx
│   └── sections
│       ├── AboutSection.tsx
│       ├── ContactSection.tsx
│       ├── HeroSection.tsx
│       ├── JourneySection.tsx
│       ├── SiteFooter.tsx
│       ├── SkillsSection.tsx
│       ├── VisionSection.tsx
│       └── WorksSection.tsx
├── data
│   └── resume.ts
├── hooks
│   ├── use-reduced-motion.ts
│   ├── use-scroll-choreography.ts
│   └── use-scroll-progress.ts
├── lib
│   └── resume-utils.ts
├── public
│   ├── favicon.svg
│   └── resume.pdf
├── CONTENT-MAP.md
├── .eslintrc.json
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

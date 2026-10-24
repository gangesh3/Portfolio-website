"use client";

import { useEffect, useState } from "react";

export const navigationItems = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "works", label: "Works" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "vision", label: "Vision" },
  { id: "contact", label: "Contact" },
] as const;

interface SideNavProps {
  reducedMotion: boolean;
}

export function SideNav({ reducedMotion }: SideNavProps) {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const sections = navigationItems
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target instanceof HTMLElement) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-24% 0px -62%", threshold: [0.05, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <nav className="side-nav" aria-label="Section navigation">
      <span className="side-nav__line" aria-hidden="true" />
      <ol>
        {navigationItems.map((item, index) => {
          const active = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                className={`side-nav__item ${active ? "is-active" : ""}`}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={active ? "location" : undefined}
                data-cursor
              >
                <span className="side-nav__index">0{index + 1}</span>
                <span className="side-nav__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

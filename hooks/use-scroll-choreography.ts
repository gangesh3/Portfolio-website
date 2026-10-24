"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function useScrollChoreography(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.dataset.enhanced = "false";
      delete document.documentElement.dataset.chapter;
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.dataset.enhanced = "true";

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
    });

    const updateProgressVariable = (instance: Lenis) => {
      const documentHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const fallbackProgress = window.scrollY / documentHeight;
      const progress = Number.isFinite(instance.progress) ? instance.progress : fallbackProgress;

      document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    const handleLenisScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      updateProgressVariable(instance);
    };
    const handleTicker = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", handleLenisScroll);
    gsap.ticker.add(handleTicker);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .filter((element) => {
          const group = element.closest<HTMLElement>("[data-stagger-group]");
          return !group || group === element;
        })
        .forEach((element, index) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 42, filter: "blur(10px)", rotateX: index % 2 === 0 ? 2 : -2 },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              rotateX: 0,
              duration: 1.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>("[data-stagger-group]").forEach((group) => {
        const items = Array.from(group.children).filter((child): child is HTMLElement => child instanceof HTMLElement);

        if (items.length === 0) {
          return;
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: 34, scale: 0.985, rotateX: 6, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: { each: 0.12, from: "start" },
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-cinematic-title]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 72, scale: 0.96, rotateX: 8, filter: "blur(9px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: element.closest<HTMLElement>("[data-cinematic-section]") ?? element,
              start: "top 82%",
              end: "top 38%",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-cinematic-copy]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 26, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: element.closest<HTMLElement>("[data-cinematic-section]") ?? element,
              start: "top 66%",
              end: "top 30%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-cinematic-float]").forEach((element, index) => {
        gsap.to(element, {
          y: index % 2 === 0 ? -22 : 22,
          ease: "none",
          scrollTrigger: {
            trigger: element.closest<HTMLElement>("[data-cinematic-section]") ?? element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      const sections = gsap.utils.toArray<HTMLElement>("[data-cinematic-section]");
      const setChapter = (section: HTMLElement | undefined) => {
        const chapter = section?.dataset.cinematicSection;

        if (chapter) {
          document.documentElement.dataset.chapter = chapter;
        }
      };

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setChapter(section),
          onEnterBack: () => setChapter(section),
          onLeaveBack: () => setChapter(sections[index - 1] ?? section),
          onUpdate: (self) => {
            const localProgress = self.progress;
            section.style.setProperty("--section-progress", localProgress.toFixed(3));
            section.style.setProperty("--cinematic-glow", (0.04 + localProgress * 0.12).toFixed(3));
          },
        });
      });

      setChapter(sections[0]);
    });

    updateProgressVariable(lenis);
    ScrollTrigger.refresh();

    return () => {
      context.revert();
      lenis.off("scroll", handleLenisScroll);
      gsap.ticker.remove(handleTicker);
      lenis.destroy();
      document.documentElement.dataset.enhanced = "false";
      delete document.documentElement.dataset.chapter;
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, [reducedMotion]);
}

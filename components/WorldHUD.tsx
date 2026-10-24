"use client";

interface WorldHUDProps {
  progress: number;
}

const chapters = ["TOP", "ABOUT", "WORKS", "SKILLS", "JOURNEY", "VISION", "CONTACT"] as const;
const chapterStarts = [0, 0.14, 0.29, 0.43, 0.57, 0.72, 0.86];

export function WorldHUD({ progress }: WorldHUDProps) {
  const normalizedProgress = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0;
  const percentage = Math.round(normalizedProgress * 100);
  const rotation = Math.round(normalizedProgress * 360);
  const chapterIndex = Math.max(
    0,
    chapterStarts.reduce((currentIndex, start, index) => (normalizedProgress >= start ? index : currentIndex), 0),
  );
  const currentChapter = chapters[chapterIndex];

  return (
    <aside className="world-hud" aria-hidden="true">
      <header className="world-hud__topline">
        <span className="world-hud__label">SYSTEM // {currentChapter}</span>
        <span className="world-hud__depth">
          <span>
            SIGNAL DEPTH // CHAPTER {String(chapterIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
          </span>
          <strong>{percentage.toString().padStart(3, "0")}%</strong>
        </span>
      </header>

      <div className="world-hud__bar" role="presentation">
        <span className="world-hud__bar-fill" style={{ width: `${percentage}%` }} />
      </div>

      <footer className="world-hud__status">
        <span className="world-hud__marker" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
          <span />
        </span>
        <span>WORLD SIGNAL // ACTIVE</span>
      </footer>
    </aside>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";

const SignalGardenCanvas = dynamic(() => import("./SignalGardenCanvas"), {
  ssr: false,
  loading: () => <SignalGardenFallback />,
});

export function SignalGardenFallback() {
  return (
    <div className="signal-garden-fallback" aria-hidden="true">
      <span className="signal-garden-fallback__ring signal-garden-fallback__ring--one" />
      <span className="signal-garden-fallback__ring signal-garden-fallback__ring--two" />
      <span className="signal-garden-fallback__core" />
    </div>
  );
}

interface SceneClientProps {
  reducedMotion: boolean;
  scrollProgress: number;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <SignalGardenFallback />;
    }

    return this.props.children;
  }
}

export function SceneClient({ reducedMotion, scrollProgress }: SceneClientProps) {
  if (reducedMotion) {
    return <SignalGardenFallback />;
  }

  return (
    <SceneErrorBoundary>
      <SignalGardenCanvas scrollProgress={scrollProgress} />
    </SceneErrorBoundary>
  );
}

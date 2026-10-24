import { PortfolioShell } from "@/components/PortfolioShell";
import { resume } from "@/data/resume";

export default function HomePage() {
  return <PortfolioShell resume={resume} />;
}

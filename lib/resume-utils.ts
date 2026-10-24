import type { Project, ResumeLinks } from "@/data/resume";

export function isTodoPlaceholder(value: string | undefined): boolean {
  return !value || value.startsWith("TODO:");
}

export function isAvailableUrl(value: string | undefined): value is string {
  if (!value || isTodoPlaceholder(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getAvailableSocialLinks(links: ResumeLinks) {
  const socialLinks: Array<{ label: string; url: string | undefined }> = [
    { label: "LinkedIn", url: links.linkedinUrl },
    { label: "GitHub", url: links.githubUrl },
  ];

  return socialLinks.filter((link): link is { label: string; url: string } => isAvailableUrl(link.url));
}

export function hasProjectLink(project: Project) {
  return isAvailableUrl(project.linkUrl);
}

import fs from "fs";
import path from "path";

export type ProjectDocLink = {
  label: string;
  url: string;
};

export type ProjectDocDetail = {
  title: string;
  overview: string;
  techStack: string[];
  links: ProjectDocLink[];
  liveUrl: string | null;
  githubUrl: string | null;
  videoUrl: string | null;
  readme: string;
};

const PROJECT_DOC_PATH = path.resolve(process.cwd(), "project_docs", "06_projects.md");

let cacheMtime = 0;
let cachedDetails: ProjectDocDetail[] = [];
let cachedByTitle = new Map<string, ProjectDocDetail>();

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseProjectSection(section: string): ProjectDocDetail {
  const title = section.match(/^##\s+\d+\.\s+(.+)$/m)?.[1]?.trim() || "Untitled Project";
  const overview = section.match(/\*\*Overview:\*\*\s*(.+)/)?.[1]?.trim() || "";
  const techStackRaw = section.match(/\*\*Tech Stack:\*\*\s*(.+)/)?.[1]?.trim() || "";
  const techStack = techStackRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const links = Array.from(section.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)/gm)).map((match) => ({
    label: match[1].trim(),
    url: match[2].trim(),
  }));

  const liveUrl = links.find((link) => /live site/i.test(link.label))?.url || null;
  const githubUrl = links.find((link) => /github/i.test(link.label))?.url || null;
  const videoUrl =
    links.find((link) => /video/i.test(link.label) || /youtube\.com|youtu\.be/i.test(link.url))?.url || null;

  const readme = section.match(/###\s+Readme\s*([\s\S]*)$/i)?.[1]?.trim() || "";

  return {
    title,
    overview,
    techStack,
    links,
    liveUrl,
    githubUrl,
    videoUrl,
    readme,
  };
}

function rebuildCache() {
  if (!fs.existsSync(PROJECT_DOC_PATH)) {
    cachedDetails = [];
    cachedByTitle = new Map();
    cacheMtime = 0;
    return;
  }

  const stats = fs.statSync(PROJECT_DOC_PATH);
  if (stats.mtimeMs === cacheMtime && cachedDetails.length > 0) {
    return;
  }

  const raw = fs.readFileSync(PROJECT_DOC_PATH, "utf8");
  const sections = raw
    .split(/\n(?=##\s+\d+\.\s+)/g)
    .filter((section) => /^##\s+\d+\.\s+/.test(section.trim()));

  cachedDetails = sections.map(parseProjectSection);
  cachedByTitle = new Map(
    cachedDetails.map((detail) => [normalizeTitle(detail.title), detail] as const),
  );
  cacheMtime = stats.mtimeMs;
}

export function getProjectDocDetailByTitle(title: string): ProjectDocDetail | null {
  rebuildCache();
  return cachedByTitle.get(normalizeTitle(title)) || null;
}

import fs from "fs";
import path from "path";
import pg from "pg";

type SeedProject = {
  title: string;
  description: string;
  tags: string[];
  liveUrl: string | null;
  sourceUrl: string | null;
  color: string;
  createdAt: Date;
};

type SeedBlogPost = {
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt: Date;
};

type SeedGuestbookEntry = {
  name: string;
  message: string;
  color: string;
  rotate: string;
  createdAt: Date;
};

const DOCS_ROOT = path.resolve(process.cwd(), "project_docs");
const BLOGS_ROOT = path.join(DOCS_ROOT, "05_blogs");
const PROJECTS_DOC = path.join(DOCS_ROOT, "06_projects.md");
const GUESTBOOK_DOC = path.join(DOCS_ROOT, "04_guestbook.md");

const STICKY_COLORS = ["yellow", "pink", "blue", "green", "white"];

function parseDotDate(input: string): Date {
  const [year, month, day] = input.split(".").map((part) => parseInt(part, 10));
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function parseFrontmatter(fileContent: string): { meta: Record<string, string>; body: string } {
  if (!fileContent.startsWith("---")) {
    return { meta: {}, body: fileContent };
  }

  const parts = fileContent.split("---");
  if (parts.length < 3) {
    return { meta: {}, body: fileContent };
  }

  const rawMeta = parts[1];
  const body = parts.slice(2).join("---").trim();
  const meta: Record<string, string> = {};

  for (const line of rawMeta.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = stripQuotes(trimmed.slice(idx + 1).trim());
    meta[key] = value;
  }

  return { meta, body };
}

function parseBlogs(): SeedBlogPost[] {
  const files = fs
    .readdirSync(BLOGS_ROOT)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const posts = files.map((file) => {
    const fullPath = path.join(BLOGS_ROOT, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { meta, body } = parseFrontmatter(raw);

    const headingMatch = body.match(/^#\s+(.+)$/m);
    const title = headingMatch?.[1]?.trim() || file.replace(/\.md$/, "");
    const excerpt = meta.excerpt || "Thoughts and notes.";
    const createdAt = meta.date ? parseDotDate(meta.date) : new Date();

    return {
      title,
      excerpt,
      content: body.trim(),
      published: true,
      createdAt,
    };
  });

  return posts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

function parseProjects(): SeedProject[] {
  const raw = fs.readFileSync(PROJECTS_DOC, "utf8");
  const sections = raw.split(/\n(?=##\s+\d+\.\s+)/g).filter((section) => /^##\s+\d+\.\s+/.test(section.trim()));

  return sections.map((section, index) => {
    const titleMatch = section.match(/^##\s+\d+\.\s+(.+)$/m);
    const overviewMatch = section.match(/\*\*Overview:\*\*\s*(.+)/);
    const techStackMatch = section.match(/\*\*Tech Stack:\*\*\s*(.+)/);
    const liveLinkMatch = section.match(/- \[Live Site\]\(([^)]+)\)/i);
    const githubMatch = section.match(/- \[GitHub\]\(([^)]+)\)/i);

    const title = titleMatch?.[1]?.trim() || `Project ${index + 1}`;
    const description = overviewMatch?.[1]?.trim() || "Project overview coming soon.";
    const tags =
      techStackMatch?.[1]
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8) || [];

    return {
      title,
      description,
      tags,
      liveUrl: liveLinkMatch?.[1]?.trim() || null,
      sourceUrl: githubMatch?.[1]?.trim() || null,
      color: STICKY_COLORS[index % STICKY_COLORS.length],
      // Keep top-of-doc projects first when API sorts by created_at DESC.
      createdAt: new Date(Date.now() - index * 60_000),
    };
  });
}

function parseGuestbookEntries(): SeedGuestbookEntry[] {
  const raw = fs.readFileSync(GUESTBOOK_DOC, "utf8");
  const tableRows = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .filter((line) => !line.includes("---"))
    .filter((line) => !line.toLowerCase().includes("| id "));

  return tableRows
    .map((row, index) => {
      const cols = row
        .split("|")
        .slice(1, -1)
        .map((value) => value.trim());

      if (cols.length < 6) {
        return null;
      }

      const name = cols[1];
      const message = cols[2];
      const date = cols[4];
      const createdAt = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00.000Z`) : new Date();

      return {
        name,
        message,
        color: STICKY_COLORS[index % STICKY_COLORS.length],
        rotate: String((index % 5) - 2),
        createdAt,
      };
    })
    .filter((entry): entry is SeedGuestbookEntry => entry !== null)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

async function seedPortfolioData() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed portfolio data.");
  }

  const projects = parseProjects();
  const blogPosts = parseBlogs();
  const guestbookEntries = parseGuestbookEntries();

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM projects");
    await client.query("DELETE FROM blog_posts");
    await client.query("DELETE FROM guestbook_entries");

    for (const project of projects) {
      await client.query(
        `
        INSERT INTO projects (title, description, tags, color, live_url, source_url, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          project.title,
          project.description,
          project.tags,
          project.color,
          project.liveUrl,
          project.sourceUrl,
          project.createdAt,
        ],
      );
    }

    for (const post of blogPosts) {
      await client.query(
        `
        INSERT INTO blog_posts (title, excerpt, content, published, created_at)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [post.title, post.excerpt, post.content, post.published, post.createdAt],
      );
    }

    for (const entry of guestbookEntries) {
      await client.query(
        `
        INSERT INTO guestbook_entries (name, message, color, rotate, created_at)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [entry.name, entry.message, entry.color, entry.rotate, entry.createdAt],
      );
    }

    await client.query("COMMIT");

    console.log(`Seed complete:
- projects: ${projects.length}
- blog_posts: ${blogPosts.length}
- guestbook_entries: ${guestbookEntries.length}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedPortfolioData().catch((error) => {
  console.error("Failed to seed portfolio data:", error);
  process.exit(1);
});

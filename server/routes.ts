import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import sharp from "sharp";
import { storage } from "./storage";
import { getProjectDocDetailByTitle } from "./projectDocs";
import {
  insertProjectSchema,
  insertBlogPostSchema,
  insertContactMessageSchema,
  guestbookStatusSchema,
} from "@shared/schema";

function parseId(idParam: string): number | null {
  const parsed = Number.parseInt(idParam, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function isAdmin(req: Request): boolean {
  return Boolean(req.session?.isAdmin);
}

function requireAdmin(req: Request, res: Response): boolean {
  if (isAdmin(req)) {
    return true;
  }
  res.status(401).json({ message: "Unauthorized" });
  return false;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (lines.length >= maxLines) {
      return lines;
    }

    if (word.length > maxCharsPerLine) {
      lines.push(word.slice(0, maxCharsPerLine - 1) + "...");
      current = "";
    } else {
      current = word;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  return lines;
}

function buildBlogOgSvg(title: string, excerpt: string): string {
  const titleLines = wrapText(title, 32, 4);
  const excerptLines = wrapText(excerpt, 72, 2);
  const titleTspans = titleLines
    .map(
      (line, index) =>
        `<tspan x="96" dy="${index === 0 ? 0 : 74}" font-size="62">${escapeXml(line)}</tspan>`,
    )
    .join("");
  const excerptTspans = excerptLines
    .map(
      (line, index) =>
        `<tspan x="96" dy="${index === 0 ? 0 : 38}" font-size="28">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(
    title,
  )}">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <rect x="24" y="24" width="1152" height="582" rx="0" stroke="#111111" stroke-width="4" fill="none"/>
  <text x="96" y="110" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="20" fill="#111111" letter-spacing="2.4">CHEICK DIAKITE / BLOG</text>
  <line x1="96" y1="132" x2="1104" y2="132" stroke="#111111" stroke-width="2"/>
  <text x="96" y="230" font-family="'Playfair Display', Georgia, serif" font-weight="700" fill="#111111">
    ${titleTspans}
  </text>
  <text x="96" y="500" font-family="'JetBrains Mono', 'Courier New', monospace" fill="#444444" letter-spacing="0.2">
    ${excerptTspans}
  </text>
  <line x1="96" y1="540" x2="1104" y2="540" stroke="#111111" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="96" y="580" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="20" fill="#111111" letter-spacing="1.8">NOTES LIKE A GO-GETTER</text>
</svg>`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const guestbookSubmissionSchema = z.object({
    name: z.string().min(2),
    message: z.string().min(5),
    color: z.string().optional(),
    rotate: z.string().optional(),
  });

  const contactReadSchema = z.object({
    read: z.boolean().optional(),
  });

  const guestbookStatusUpdateSchema = z.object({
    status: guestbookStatusSchema,
  });

  // ---- ADMIN AUTH ----
  app.get("/api/admin/session", (req, res) => {
    res.json({ authenticated: isAdmin(req) });
  });

  app.post("/api/admin/login", (req, res) => {
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || password !== expectedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.isAdmin = true;
    return res.status(204).send();
  });

  app.post("/api/admin/logout", (req, res) => {
    if (!req.session) {
      return res.status(204).send();
    }

    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("portfolio.sid");
      return res.status(204).send();
    });
  });

  // ---- OPEN GRAPH IMAGES ----
  app.get("/og/blog/:id.svg", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).send("Invalid blog id");

    const post = await storage.getBlogPost(id);
    if (!post || !post.published) return res.status(404).send("Not found");

    const svg = buildBlogOgSvg(post.title, post.excerpt);
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return res.status(200).send(svg);
  });

  app.get("/og/blog/:id.png", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).send("Invalid blog id");

    const post = await storage.getBlogPost(id);
    if (!post || !post.published) return res.status(404).send("Not found");

    const svg = buildBlogOgSvg(post.title, post.excerpt);
    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return res.status(200).send(png);
  });

  // ---- PROJECTS ----
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id/details", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid project id" });

    const project = await storage.getProject(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const detail = getProjectDocDetailByTitle(project.title);
    const fallbackLinks = [
      project.liveUrl ? { label: "Live Site", url: project.liveUrl } : null,
      project.sourceUrl ? { label: "GitHub", url: project.sourceUrl } : null,
    ].filter((item): item is { label: string; url: string } => item !== null);

    res.json({
      id: project.id,
      title: project.title,
      description: project.description,
      color: project.color,
      tags: project.tags,
      liveUrl: project.liveUrl,
      sourceUrl: project.sourceUrl,
      overview: detail?.overview || project.description,
      techStack: detail?.techStack?.length ? detail.techStack : project.tags,
      links: detail?.links?.length ? detail.links : fallbackLinks,
      videoUrl: detail?.videoUrl || null,
      readme: detail?.readme || "",
    });
  });

  app.post("/api/projects", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.put("/api/projects/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid project id" });
    const updated = await storage.updateProject(id, req.body);
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid project id" });
    await storage.deleteProject(id);
    res.status(204).send();
  });

  // ---- BLOG POSTS ----
  app.get("/api/blog", async (req, res) => {
    const publishedOnly = req.query.published === "true";
    if (!publishedOnly && !isAdmin(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const posts = await storage.getBlogPosts(publishedOnly);
    res.json(posts);
  });

  app.get("/api/blog/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid blog id" });

    const post = await storage.getBlogPost(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.published && !isAdmin(req)) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  app.post("/api/blog", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const post = await storage.createBlogPost(parsed.data);
    res.status(201).json(post);
  });

  app.put("/api/blog/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid blog id" });
    const updated = await storage.updateBlogPost(id, req.body);
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json(updated);
  });

  app.delete("/api/blog/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid blog id" });
    await storage.deleteBlogPost(id);
    res.status(204).send();
  });

  // ---- GUESTBOOK ----
  app.get("/api/guestbook", async (_req, res) => {
    const entries = await storage.getGuestbookEntries(true);
    res.json(entries);
  });

  app.get("/api/admin/guestbook", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const entries = await storage.getGuestbookEntries(false);
    res.json(entries);
  });

  app.post("/api/guestbook", async (req, res) => {
    const parsed = guestbookSubmissionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const entry = await storage.createGuestbookEntry({
      name: parsed.data.name,
      message: parsed.data.message,
      color: parsed.data.color ?? "yellow",
      rotate: parsed.data.rotate ?? "0",
    });
    res.status(201).json(entry);
  });

  app.patch("/api/guestbook/:id/status", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid guestbook id" });

    const parsed = guestbookStatusUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

    const updated = await storage.updateGuestbookEntryStatus(id, parsed.data.status);
    if (!updated) return res.status(404).json({ message: "Guestbook entry not found" });
    res.json(updated);
  });

  app.delete("/api/guestbook/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid guestbook id" });
    await storage.deleteGuestbookEntry(id);
    res.status(204).send();
  });

  // ---- CONTACT MESSAGES ----
  app.get("/api/contact", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.post("/api/contact", async (req, res) => {
    const parsed = insertContactMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const message = await storage.createContactMessage(parsed.data);
    res.status(201).json(message);
  });

  app.patch("/api/contact/:id/read", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid contact id" });
    const parsed = contactReadSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    await storage.setContactMessageRead(id, parsed.data.read ?? true);
    res.status(204).send();
  });

  app.delete("/api/contact/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid contact id" });
    await storage.deleteContactMessage(id);
    res.status(204).send();
  });

  return httpServer;
}

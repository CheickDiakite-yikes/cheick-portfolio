import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getProjectDocDetailByTitle } from "./projectDocs";
import {
  insertProjectSchema,
  insertBlogPostSchema,
  insertGuestbookEntrySchema,
  insertContactMessageSchema,
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
    const entries = await storage.getGuestbookEntries();
    res.json(entries);
  });

  app.post("/api/guestbook", async (req, res) => {
    const parsed = insertGuestbookEntrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const entry = await storage.createGuestbookEntry(parsed.data);
    res.status(201).json(entry);
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
    await storage.markContactMessageRead(id);
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

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProjectSchema,
  insertBlogPostSchema,
  insertGuestbookEntrySchema,
  insertContactMessageSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ---- PROJECTS ----
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.put("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateProject(id, req.body);
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    await storage.deleteProject(parseInt(req.params.id));
    res.status(204).send();
  });

  // ---- BLOG POSTS ----
  app.get("/api/blog", async (req, res) => {
    const publishedOnly = req.query.published === "true";
    const posts = await storage.getBlogPosts(publishedOnly);
    res.json(posts);
  });

  app.get("/api/blog/:id", async (req, res) => {
    const post = await storage.getBlogPost(parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post("/api/blog", async (req, res) => {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const post = await storage.createBlogPost(parsed.data);
    res.status(201).json(post);
  });

  app.put("/api/blog/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateBlogPost(id, req.body);
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json(updated);
  });

  app.delete("/api/blog/:id", async (req, res) => {
    await storage.deleteBlogPost(parseInt(req.params.id));
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
    await storage.deleteGuestbookEntry(parseInt(req.params.id));
    res.status(204).send();
  });

  // ---- CONTACT MESSAGES ----
  app.get("/api/contact", async (_req, res) => {
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
    await storage.markContactMessageRead(parseInt(req.params.id));
    res.status(204).send();
  });

  app.delete("/api/contact/:id", async (req, res) => {
    await storage.deleteContactMessage(parseInt(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}

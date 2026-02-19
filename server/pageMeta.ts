import type { Request } from "express";
import { storage } from "./storage";

type PageMeta = {
  title: string;
  description: string;
  ogType: "website" | "article";
  imageUrl: string;
};

const DEFAULT_TITLE = "Cheick Diakite - AI, Product & Finance";
const DEFAULT_DESCRIPTION =
  "Google DeepMind Hackathon Winner blending $11B+ in IB/PE M&A experience with hands-on AI engineering and 0->1 product execution.";
const DEFAULT_OG_IMAGE = "/opengraph.png";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceTag(html: string, pattern: RegExp, replacement: string): string {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html;
}

function resolveBaseUrl(req: Request): string {
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return `https://${process.env.REPLIT_INTERNAL_APP_DOMAIN}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }

  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol =
    typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0].trim()
      : req.protocol || "http";
  const host = req.get("host");
  return `${protocol}://${host}`;
}

async function getPageMeta(req: Request): Promise<PageMeta> {
  const baseUrl = resolveBaseUrl(req);
  const defaultMeta: PageMeta = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogType: "website",
    imageUrl: `${baseUrl}${DEFAULT_OG_IMAGE}`,
  };

  const blogMatch = req.path.match(/^\/blog\/(\d+)\/?$/);
  if (!blogMatch) {
    return defaultMeta;
  }

  const postId = Number.parseInt(blogMatch[1], 10);
  if (Number.isNaN(postId)) {
    return defaultMeta;
  }

  const post = await storage.getBlogPost(postId);
  if (!post || !post.published) {
    return defaultMeta;
  }

  return {
    title: `${post.title} - Cheick Diakite`,
    description: post.excerpt,
    ogType: "article",
    imageUrl: `${baseUrl}/og/blog/${post.id}.png`,
  };
}

export async function applyRequestMeta(req: Request, html: string): Promise<string> {
  const meta = await getPageMeta(req);
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const imageUrl = escapeHtml(meta.imageUrl);

  let result = html;
  result = replaceTag(result, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  result = replaceTag(
    result,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${meta.ogType}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${imageUrl}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${title}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${description}" />`,
  );
  result = replaceTag(
    result,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${imageUrl}" />`,
  );

  return result;
}

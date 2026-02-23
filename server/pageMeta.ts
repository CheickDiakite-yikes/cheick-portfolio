import type { Request } from "express";
import { storage } from "./storage";

type PageMeta = {
  title: string;
  description: string;
  ogType: "website" | "article";
  imageUrl: string;
  imageAlt: string;
  pageUrl: string;
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

function upsertHeadTag(html: string, pattern: RegExp, replacement: string): string {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  if (!html.includes("</head>")) {
    return html;
  }

  return html.replace("</head>", `  ${replacement}\n  </head>`);
}

function resolveBaseUrl(req: Request): string {
  const host = req.get("host");
  if (host) {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const protocol =
      typeof forwardedProto === "string"
        ? forwardedProto.split(",")[0].trim()
        : "https";
    return `${protocol}://${host}`;
  }

  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return `https://${process.env.REPLIT_INTERNAL_APP_DOMAIN}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }

  return `https://${req.hostname}`;
}

async function getPageMeta(req: Request): Promise<PageMeta> {
  const baseUrl = resolveBaseUrl(req);
  const pagePath = req.path || "/";
  const normalizedPath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;

  const defaultMeta: PageMeta = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogType: "website",
    imageUrl: `${baseUrl}${DEFAULT_OG_IMAGE}`,
    imageAlt: "Cheick Diakite portfolio preview image",
    pageUrl: `${baseUrl}${normalizedPath}`,
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
    imageAlt: `Preview image for blog post: ${post.title}`,
    pageUrl: `${baseUrl}/blog/${post.id}`,
  };
}

export async function applyRequestMeta(req: Request, html: string): Promise<string> {
  const meta = await getPageMeta(req);
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const imageUrl = escapeHtml(meta.imageUrl);
  const imageAlt = escapeHtml(meta.imageAlt);
  const pageUrl = escapeHtml(meta.pageUrl);

  let result = html;
  result = upsertHeadTag(result, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  result = upsertHeadTag(
    result,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${meta.ogType}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${pageUrl}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${imageUrl}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${imageUrl}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:type" content="image/png" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:width" content="1200" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:height" content="675" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${title}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${description}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${imageUrl}" />`,
  );
  result = upsertHeadTag(
    result,
    /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
  );
  result = upsertHeadTag(
    result,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${pageUrl}" />`,
  );

  return result;
}

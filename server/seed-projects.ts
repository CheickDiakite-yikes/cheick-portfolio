import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { projects } from "@shared/schema";

const REQUIRED_PROJECTS = [
  {
    title: "Soulnests",
    description: "The world's most comprehensive mental health & wellness platform with AI journaling, voice companions, habit intelligence, guided meditations with AI-composed music, fitness planning, and 12 brain training games. 140,000+ lines of production code.",
    tags: ["GPT-5.1", "Gemini 2.5", "Lyria", "Gemini Live API", "TypeScript", "React 18", "PostgreSQL", "Drizzle ORM"],
    color: "yellow",
    liveUrl: "https://soulnests.com/",
    sourceUrl: null as string | null,
    createdAt: "2026-02-19 03:40:36",
  },
  {
    title: "Predi AI",
    description: "AI-native marketing OS—autonomous CMO using Gemini 3 Pro and Veo 3.1 to generate on-brand strategy, copy, high-fidelity images, and cinematic video.",
    tags: ["Gemini 3 Pro", "Veo 3.1", "Gemini Vision", "React 19", "TypeScript", "Tailwind CSS", "@google/genai"],
    color: "blue",
    liveUrl: "https://prediai.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/AI-UGC-Marketing",
    createdAt: "2026-02-19 03:40:35",
  },
  {
    title: "ZeeMe (My AI Companion)",
    description: "Multimodal AI companion application with unified text + live voice memory, image-aware chat, personalization, and themeable mobile-first UI.",
    tags: ["Gemini 3 Flash", "Gemini 2.5 Flash Native Audio", "React 19", "TypeScript", "Vite", "Express.js", "PostgreSQL", "Drizzle ORM"],
    color: "pink",
    liveUrl: "https://zeeme.io",
    sourceUrl: "https://github.com/CheickDiakite-yikes/my-ai-companion",
    createdAt: "2026-02-19 03:39:34.323",
  },
  {
    title: "Sparkie (Insparkie)",
    description: "AI product planning workspace that turns raw startup ideas into structured outputs including market research, technical strategy, PRD, UI/UX direction, and implementation prompts.",
    tags: ["Gemini 2.5 Flash", "Gemini 3 Pro Image", "React 19", "TypeScript", "Vite", "Express.js", "PostgreSQL", "Replit Object Storage"],
    color: "blue",
    liveUrl: "https://insparkie.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/sparkie",
    createdAt: "2026-02-19 03:38:34.323",
  },
  {
    title: "LessonCraft",
    description: "AI-powered K-12 lesson planning platform for teachers—generates differentiated, standards-aligned lesson plans from single periods to full semesters with worksheets, presentation slides, vocabulary lists, and visual lesson calendars using Gemini AI and Imagen 3.0.",
    tags: ["Gemini 2.5 Flash", "Imagen 3.0", "Next.js 15", "TypeScript", "PostgreSQL", "Drizzle ORM", "NextAuth.js", "Tailwind CSS"],
    color: "yellow",
    liveUrl: "https://Lessies.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/AI-Lessons-k12",
    createdAt: "2026-02-19 03:37:54.323",
  },
  {
    title: "Simili (AI Life Simulator)",
    description: "Hyper-realistic AI life simulation game where players experience thousands of possible life paths shaped by environment, luck, and choice.",
    tags: ["Gemini API", "React 19", "TypeScript", "Vite", "Express 5", "PostgreSQL", "Drizzle ORM", "Replit Object Storage"],
    color: "green",
    liveUrl: "https://simili-ai.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/ai-life-simulator",
    createdAt: "2026-02-19 03:37:34.323",
  },
  {
    title: "Kumayiri",
    description: "AI-powered comic creation platform with character consistency, Story Bible system, and Veo3 video animations. Winner among 831 global submissions at Google DeepMind Hackathon.",
    tags: ["Gemini 2.0 Flash", "Veo3", "Gemini Vision", "TypeScript", "React", "Express.js", "PostgreSQL", "Drizzle ORM"],
    color: "yellow",
    liveUrl: "https://Kumayiri.com",
    sourceUrl: "https://github.com/CheickDiakite-yikes/comicbook-ai",
    createdAt: "2026-02-19 03:36:34.323",
  },
  {
    title: "DiDi",
    description: "The world's first open-source autonomous PE firm—AI agents for deal sourcing, deep diligence, LBO modeling, and IC memos. Cuts first-draft time by 70-90%.",
    tags: ["Gemini 3 Pro", "Multi-Agent Swarm", "React 19", "TypeScript", "Recharts", "SheetJS", "@google/genai", "Tailwind CSS"],
    color: "green",
    liveUrl: "https://didimemo.com",
    sourceUrl: "https://github.com/CheickDiakite-yikes/AI-PE-Analyst",
    createdAt: "2026-02-19 03:35:34.323",
  },
  {
    title: "EchoLingo",
    description: "AI-powered language learning platform for ELL students—empowers teachers with AI assignment generation, smart grading, and personalized parrot-guided feedback.",
    tags: ["GPT-4", "DALL-E 3", "React 18", "TypeScript", "PostgreSQL", "Drizzle ORM", "Express.js", "Passport.js"],
    color: "yellow",
    liveUrl: "https://AI-ELL.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/AIESL",
    createdAt: "2026-02-19 03:34:34.323",
  },
  {
    title: "Mosaic",
    description: "AI-powered photo editor built with React 19 and Gemini 2.5—features precise localized retouching, creative style filters, image mixing, smart cropping, and background removal using natural language.",
    tags: ["Gemini 2.5 Flash", "React 19", "TypeScript", "HTML5 Canvas", "Tailwind CSS", "@google/genai", "react-image-crop"],
    color: "pink",
    liveUrl: "https://mosaic-CheickDiakite.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/mosaic",
    createdAt: "2026-02-19 03:33:34.323",
  },
  {
    title: "AuroraTravel",
    description: "AI-powered travel planning platform that creates personalized multi-day itineraries with maps, weather, packing lists, and local insights using Gemini 2.5.",
    tags: ["Gemini 2.5 Flash", "Google Maps API", "Google Search Grounding", "React 19", "TypeScript", "Express.js", "PostgreSQL", "Drizzle ORM"],
    color: "blue",
    liveUrl: "https://tripper-CheickDiakite.replit.app",
    sourceUrl: null as string | null,
    createdAt: "2026-02-19 03:32:34.323",
  },
  {
    title: "TeaClass",
    description: "Intelligent lesson planning platform for K-12 ELL educators—generates standards-aligned unit plans, differentiated worksheets, presentations, and visual vocabulary with Gemini 2.5.",
    tags: ["Gemini 2.5 Flash", "React 19", "Express.js", "PostgreSQL", "Drizzle ORM", "Passport.js", "Tailwind CSS"],
    color: "green",
    liveUrl: "https://ai-lesson-planner-cheickdiakite.replit.app/",
    sourceUrl: "https://github.com/CheickDiakite-yikes/ell-lesson-planner",
    createdAt: "2026-02-19 03:31:34.323",
  },
  {
    title: "LucentHire",
    description: "AI-powered resume analysis platform using GPT-4o and LlamaParse—bulk upload 50+ resumes, intelligent job matching, candidate ranking, and detailed scoring insights.",
    tags: ["GPT-4o", "LlamaParse", "React 18", "TypeScript", "PostgreSQL", "Drizzle ORM", "Express.js", "Multer"],
    color: "yellow",
    liveUrl: "https://ai-recruitment-pro-CheickDiakite.replit.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/ai-recruiter",
    createdAt: "2026-02-19 03:30:34.323",
  },
  {
    title: "Narra",
    description: "Multimodal AI storytelling platform—weaves custom illustrated books with consistent characters, artwork, and audio narration using Gemini 3 Pro.",
    tags: ["Gemini 3 Pro", "Gemini TTS", "React 19", "IndexedDB", "3D Effects", "TypeScript", "Tailwind CSS"],
    color: "pink",
    liveUrl: null as string | null,
    sourceUrl: "https://github.com/CheickDiakite-yikes/story",
    createdAt: "2026-02-19 03:29:34.323",
  },
  {
    title: "Apex Capital AI",
    description: "Terminal-style AI investment analyst that streams real-time market data, performs DCF/comparable analysis, and generates institutional-grade equity research using multi-agent AI.",
    tags: ["Gemini 2.5 Pro", "Multi-Agent AI", "React 18", "TypeScript", "Tailwind CSS", "Recharts", "cobe"],
    color: "green",
    liveUrl: "https://ai-terminal-52558666644.us-west1.run.app",
    sourceUrl: "https://github.com/CheickDiakite-yikes/apexcapital",
    createdAt: "2026-02-19 03:27:34.323",
  },
  {
    title: "ADIOS",
    description: "AI video generation pipeline that transforms text prompts into short-form social media videos with AI voiceover, stock footage, and automatic editing.",
    tags: ["GPT-4o-mini", "Azure TTS", "MoviePy", "Pexels API", "Flask", "React", "HTML5/CSS3"],
    color: "blue",
    liveUrl: null as string | null,
    sourceUrl: null as string | null,
    createdAt: "2026-02-19 03:26:34.323",
  },
  {
    title: "Shorty",
    description: "AI-powered URL shortener with custom slugs, click analytics, QR code generation, and geographic tracking—built with Gemini for smart link suggestions.",
    tags: ["Gemini 2.5 Flash", "React 19", "TypeScript", "Express.js", "PostgreSQL", "Drizzle ORM", "Tailwind CSS"],
    color: "pink",
    liveUrl: null as string | null,
    sourceUrl: null as string | null,
    createdAt: "2026-02-19 03:25:34.323",
  },
  {
    title: "PokePals",
    description: "Identify your friends as collectible monster trading cards! AI analyzes photos to generate unique stats, types, moves, and rarities based on the environment.",
    tags: ["Gemini API", "React 19", "Express.js", "PostgreSQL", "Drizzle ORM", "TypeScript", "Tailwind CSS"],
    color: "yellow",
    liveUrl: "https://pokepals-cheickdiakite.replit.app/",
    sourceUrl: "https://github.com/CheickDiakite-yikes/pokepals-ai",
    createdAt: "2026-02-19 03:24:34.323",
  },
  {
    title: "Marison Energy Systems",
    description: "International business development platform specializing in US-Africa trade and investment in the energy sector. Provides context-sensitive and cost-effective solutions for powering Africa with North American expertise and technology.",
    tags: ["React", "TypeScript", "Business Development", "Energy Sector"],
    color: "orange",
    liveUrl: "https://marisonenergy.com",
    sourceUrl: null as string | null,
    createdAt: "2026-02-19 03:20:00.000",
  },
];

export async function seedProjects() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const existing = await db.select().from(projects);
    const existingByTitle = new Map(existing.map(p => [p.title, p]));

    let inserted = 0;
    let updated = 0;

    for (const proj of REQUIRED_PROJECTS) {
      const existingProj = existingByTitle.get(proj.title);

      if (!existingProj) {
        await pool.query(
          `INSERT INTO projects (title, description, tags, color, live_url, source_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [proj.title, proj.description, proj.tags, proj.color, proj.liveUrl, proj.sourceUrl, proj.createdAt]
        );
        inserted++;
      } else {
        await pool.query(
          `UPDATE projects SET description = $1, tags = $2, color = $3, live_url = $4, source_url = $5, created_at = $6 WHERE id = $7`,
          [proj.description, proj.tags, proj.color, proj.liveUrl, proj.sourceUrl, proj.createdAt, existingProj.id]
        );
        updated++;
      }
    }

    if (inserted > 0 || updated > 0) {
      console.log(`[seed] Projects synced: ${inserted} inserted, ${updated} updated`);
    } else {
      console.log(`[seed] All ${REQUIRED_PROJECTS.length} projects already up to date`);
    }
  } catch (err) {
    console.error("[seed] Error seeding projects:", err);
  } finally {
    await pool.end();
  }
}

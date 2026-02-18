# Portfolio - Neo-Classical Brutalist Notebook

## Overview

This is a personal portfolio website for Cheick Diakite, built with a neo-classical brutalist design aesthetic featuring a tactile notebook feel. The app includes pages for Home, About, Projects, Resume, Blog, Guestbook, Contact, and an Admin panel. It combines sticky-note UI elements, typewriter animations, and a paper-like visual theme with a full-stack architecture backed by PostgreSQL.

The portfolio showcases an AI-focused career background spanning investment banking, private equity, and AI engineering, with blog posts covering AI, neuroscience, philosophy, and technology topics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming; custom design tokens for paper/ink/sticky-note colors
- **Animations**: Framer Motion for page transitions, component animations, and hover effects
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Fonts**: Playfair Display (serif/neo-classical), JetBrains Mono (monospace/brutalist), Architects Daughter (handwritten), Inter (sans-serif)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via tsx
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **API Resources**: Projects, Blog Posts, Guestbook Entries, Contact Messages, Users
- **Dev Server**: Vite dev server integrated as middleware in development; static file serving in production
- **Build**: Vite for client, esbuild for server (outputs to `dist/`)

### Database
- **Database**: PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Tables**:
  - `users` — id (UUID), username, password
  - `projects` — id, title, description, tags (text array), color, liveUrl, sourceUrl, createdAt
  - `blog_posts` — id, title, excerpt, content, published (boolean), createdAt
  - `guestbook_entries` — id, name, message, color, rotate, createdAt
  - `contact_messages` — id, email, subject, message, read (boolean), createdAt

### Key Design Decisions
- **Shared schema**: The `shared/` directory contains database schema and TypeScript types used by both frontend and backend, ensuring type safety across the stack
- **No authentication middleware**: The admin panel uses a simple hardcoded password (`admin123`) client-side — there is no server-side auth/session management for admin routes currently
- **Brutalist design system**: Custom CSS variables define a paper/ink color palette; `shadow-brutal` utility classes create the signature brutalist box-shadow aesthetic
- **SPA with server fallback**: All unmatched routes fall through to `index.html` for client-side routing

### Pages
- `/` — Home with typewriter animation and sticky notes
- `/about` — About page (currently has placeholder content, should match project_docs/01_about.md)
- `/projects` — Dynamic projects from database, displayed as sticky notes
- `/resume` — Resume page (currently has placeholder content, should match project_docs/02_resume.md)
- `/blog` — Blog posts from database, filtered to published only
- `/guestbook` — User-submitted sticky notes with random colors/rotations
- `/contact` — Contact form that submits to database
- `/admin` — CRUD admin panel for all content types

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection string via `DATABASE_URL` environment variable. Used for all persistent data storage.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **express**: HTTP server framework (v5)
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **wouter**: Client-side routing
- **zod** + **drizzle-zod**: Schema validation
- **react-hook-form**: Form state management
- **shadcn/ui components**: Full suite of Radix-based UI components
- **date-fns**: Date formatting
- **connect-pg-simple**: PostgreSQL session store (available but not actively used)

### External Resources (CDN)
- Google Fonts: Playfair Display, JetBrains Mono, Architects Daughter, Inter
- Grainy gradients SVG for texture overlay
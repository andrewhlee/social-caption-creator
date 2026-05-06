# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured.

## Environment

Requires `.env.local` with:
```
ANTHROPIC_API_KEY=...
```

## Architecture

This is a Princeton Day School internal tool for generating Instagram captions from photos. It uses Next.js 16 App Router, React 19, Tailwind CSS v4, and the Anthropic SDK.

**Two-tab UI** (`src/app/page.tsx`):
- **Generate Caption** — user uploads a photo + writes context, gets an AI-generated caption streamed back
- **Writing Style Library** — CRUD interface for storing example captions that inform future generations

**Caption generation flow** (`src/app/api/generate-caption/route.ts`):
1. Receives `multipart/form-data` with an image file and `backgroundInfo` text
2. `getRelevantEntries()` (keyword + recency scoring) fetches up to 5 matching knowledge base examples
3. `buildUserMessage()` injects those examples as few-shot context alongside the system prompt
4. Calls `anthropic.messages.stream()` with `claude-sonnet-4-6`, sending the image as base64 and the constructed text message
5. Returns an SSE stream (`text/event-stream`); client reads `data: {"text":"..."}` chunks until `data: [DONE]`

**Knowledge base** (`src/lib/knowledge-base.ts`):
- Persisted as JSON at `data/knowledge-base/entries.json` (flat file, no database)
- `getRelevantEntries()` tokenizes query text, scores entries by keyword overlap plus recency bonus, returns top 5
- Tags are auto-generated from caption + context text at write time (stop-word filtered tokens)

**API routes**:
- `POST /api/generate-caption` — SSE streaming endpoint, accepts `multipart/form-data`
- `GET|POST|DELETE /api/knowledge-base` — CRUD for knowledge base entries; DELETE uses `?id=` query param

**Key constraints**:
- `next.config.ts` sets `serverActions.bodySizeLimit: "10mb"` to accommodate image uploads
- Supported image types: JPEG, PNG, GIF, WebP (enforced in `src/lib/image-utils.ts`)
- PDS brand colors (`pds-navy`, `pds-gold`) are Tailwind custom colors — check `globals.css` or `tailwind.config` before adding new brand styles
- The system prompt and caption style rules live in `src/lib/prompt-builder.ts`; edit there to change PDS voice/tone/format requirements

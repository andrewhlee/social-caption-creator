import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { KnowledgeBaseEntry } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data", "knowledge-base");
const ENTRIES_FILE = path.join(DATA_DIR, "entries.json");

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "our", "we", "us", "their", "they", "it",
  "this", "that", "these", "those", "as", "so", "if", "when", "all",
]);

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ENTRIES_FILE)) {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify([], null, 2));
  }
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function getAllEntries(): KnowledgeBaseEntry[] {
  ensureDataDir();
  const raw = fs.readFileSync(ENTRIES_FILE, "utf-8");
  const entries: KnowledgeBaseEntry[] = JSON.parse(raw);
  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addEntry(
  caption: string,
  context: string
): KnowledgeBaseEntry {
  ensureDataDir();
  const entries = getAllEntries();
  const tags = tokenize(`${caption} ${context}`);
  const newEntry: KnowledgeBaseEntry = {
    id: uuidv4(),
    caption,
    context,
    tags: [...new Set(tags)],
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
  return newEntry;
}

export function deleteEntry(id: string): boolean {
  ensureDataDir();
  const entries = getAllEntries();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  fs.writeFileSync(ENTRIES_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

export function getRelevantEntries(
  backgroundInfo: string,
  limit = 5
): KnowledgeBaseEntry[] {
  const entries = getAllEntries();
  if (entries.length === 0) return [];

  const queryTokens = tokenize(backgroundInfo);
  const now = Date.now();

  const scored = entries.map((entry) => {
    const entryText = `${entry.caption} ${entry.context} ${entry.tags.join(" ")}`;
    const entryTokens = new Set(tokenize(entryText));

    let score = queryTokens.filter((t) => entryTokens.has(t)).length;

    // Recency bonus
    const ageMs = now - new Date(entry.createdAt).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays < 30) score += 1;
    else if (ageDays < 90) score += 0.5;

    return { entry, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

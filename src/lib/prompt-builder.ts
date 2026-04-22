import { KnowledgeBaseEntry } from "@/types";

export const SYSTEM_PROMPT = `You are a social media content specialist for Princeton Day School (PDS), a PreK–12 independent school in Princeton, NJ. Your job is to write Instagram captions that authentically represent PDS's voice.

Princeton Day School's brand voice is:
- Warm and community-focused, not corporate or stiff
- Celebratory of student achievement, growth, and curiosity
- Inclusive and supportive across all grade levels (PreK through 12)
- Occasionally uses light humor, but always remains professional
- Uses 3–5 relevant hashtags per post, always including #PrincetonDaySchool
- Captions are 2–4 sentences for photo posts
- Emojis are used sparingly (1–2 per caption maximum)

Writing style guidelines:
- Write in present tense when describing activities in progress
- Use past tense when celebrating completed achievements or events
- Lead with what's happening or who is featured, not with "We are excited to share..."
- Avoid clichés like "proud to announce" or "thrilled to share"
- Reference specific details when possible to make captions feel genuine`;

export function buildUserMessage(
  backgroundInfo: string,
  relevantEntries: KnowledgeBaseEntry[]
): string {
  let message = "";

  if (relevantEntries.length > 0) {
    message += `Here are examples of past Princeton Day School Instagram captions. Use these to match our tone and style:\n\n`;
    relevantEntries.forEach((entry, i) => {
      message += `Example ${i + 1}:\nCaption: "${entry.caption}"`;
      if (entry.context) message += `\nContext: ${entry.context}`;
      message += "\n\n";
    });
    message += "---\n\n";
  }

  message += `Now generate a new Instagram caption for the attached photo.\n\n`;
  message += `Background information about this photo:\n${backgroundInfo}\n\n`;
  message += `Generate a caption that:\n`;
  message += `1. Matches the PDS voice shown above\n`;
  message += `2. Is 2–4 sentences long\n`;
  message += `3. Includes 3–5 relevant hashtags at the end\n`;
  message += `4. Uses 1–2 emojis at most\n`;
  message += `5. Celebrates or acknowledges the people/event shown\n\n`;
  message += `Respond with ONLY the caption text, no explanations or commentary.`;

  return message;
}

export interface KnowledgeBaseEntry {
  id: string;
  caption: string;
  context: string;
  tags: string[];
  createdAt: string;
}

export interface GenerateCaptionResponse {
  caption: string;
  error?: string;
}

export interface KnowledgeBaseResponse {
  entries: KnowledgeBaseEntry[];
}

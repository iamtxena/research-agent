export interface ResearchOptions {
  model?: string;
  fileSearchStore?: string;
  enableWebSearch?: boolean;
  enableUrlContext?: boolean;
  thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
}

export interface FileUploadOptions {
  storeName: string;
  displayName?: string;
  metadata?: Record<string, string | number>;
  chunkingConfig?: {
    maxTokensPerChunk?: number;
    maxOverlapTokens?: number;
  };
}

export interface ResearchResult {
  text: string;
  sources?: Array<{
    url?: string;
    title?: string;
  }>;
  groundingMetadata?: unknown;
  reasoning?: string;
}

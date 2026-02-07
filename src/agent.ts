/**
 * Gemini Research Agent
 * Uses AI SDK with Google provider for research capabilities
 */

import { google, type GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { ResearchOptions, ResearchResult } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Research a topic using web search grounding
 */
export async function researchWeb(
  query: string,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const model = google(options.model || DEFAULT_MODEL);

  const { text, sources, providerMetadata, reasoning } = await generateText({
    model,
    prompt: query,
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    providerOptions: {
      google: {
        thinkingConfig: options.thinkingLevel
          ? { thinkingLevel: options.thinkingLevel, includeThoughts: true }
          : undefined,
      },
    },
  });

  const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;

  return {
    text,
    sources: sources?.map((s) => ({ url: s.url, title: s.title })),
    groundingMetadata: metadata?.groundingMetadata,
    reasoning,
  };
}

/**
 * Research using a File Search Store
 */
export async function researchFileStore(
  query: string,
  fileSearchStoreName: string,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const model = google(options.model || DEFAULT_MODEL);

  const { text, sources, providerMetadata, reasoning } = await generateText({
    model,
    prompt: query,
    tools: {
      file_search: google.tools.fileSearch({
        fileSearchStoreNames: [fileSearchStoreName],
      }),
    },
    providerOptions: {
      google: {
        thinkingConfig: options.thinkingLevel
          ? { thinkingLevel: options.thinkingLevel, includeThoughts: true }
          : undefined,
      },
    },
  });

  const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;

  return {
    text,
    sources: sources?.map((s) => ({ url: s.url, title: s.title })),
    groundingMetadata: metadata?.groundingMetadata,
    reasoning,
  };
}

/**
 * Analyze a local file (PDF, image, etc.)
 */
export async function analyzeFile(
  filePath: string,
  query: string,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const model = google(options.model || DEFAULT_MODEL);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
  };

  const mediaType = mimeTypes[ext] || 'application/octet-stream';

  const { text, reasoning } = await generateText({
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: query },
          { type: 'file', data: fileBuffer, mediaType },
        ],
      },
    ],
    providerOptions: {
      google: {
        thinkingConfig: options.thinkingLevel
          ? { thinkingLevel: options.thinkingLevel, includeThoughts: true }
          : undefined,
      },
    },
  });

  return { text, reasoning };
}

/**
 * Analyze a YouTube video
 */
export async function analyzeYouTube(
  youtubeUrl: string,
  query: string,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const model = google(options.model || DEFAULT_MODEL);

  const { text, reasoning } = await generateText({
    model,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: query },
          { type: 'file', data: youtubeUrl, mediaType: 'video/mp4' },
        ],
      },
    ],
    providerOptions: {
      google: {
        thinkingConfig: options.thinkingLevel
          ? { thinkingLevel: options.thinkingLevel, includeThoughts: true }
          : undefined,
      },
    },
  });

  return { text, reasoning };
}

/**
 * Analyze a URL using URL Context
 */
export async function analyzeUrl(
  url: string,
  query: string,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const model = google(options.model || DEFAULT_MODEL);

  const { text, sources, providerMetadata, reasoning } = await generateText({
    model,
    prompt: `Based on this URL: ${url}\n\n${query}`,
    tools: {
      url_context: google.tools.urlContext({}),
    },
    providerOptions: {
      google: {
        thinkingConfig: options.thinkingLevel
          ? { thinkingLevel: options.thinkingLevel, includeThoughts: true }
          : undefined,
      },
    },
  });

  const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;

  return {
    text,
    sources: sources?.map((s) => ({ url: s.url, title: s.title })),
    groundingMetadata: metadata?.groundingMetadata,
    reasoning,
  };
}

/**
 * Combined research: File Store + Web Search
 */
export async function researchCombined(
  query: string,
  fileSearchStoreName: string,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const model = google(options.model || DEFAULT_MODEL);

  const { text, sources, providerMetadata, reasoning } = await generateText({
    model,
    prompt: query,
    tools: {
      file_search: google.tools.fileSearch({
        fileSearchStoreNames: [fileSearchStoreName],
      }),
      google_search: google.tools.googleSearch({}),
    },
    providerOptions: {
      google: {
        thinkingConfig: options.thinkingLevel
          ? { thinkingLevel: options.thinkingLevel, includeThoughts: true }
          : undefined,
      },
    },
  });

  const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;

  return {
    text,
    sources: sources?.map((s) => ({ url: s.url, title: s.title })),
    groundingMetadata: metadata?.groundingMetadata,
    reasoning,
  };
}

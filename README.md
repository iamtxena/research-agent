# 🔍 Gemini Research Agent

AI-powered research agent using Gemini and AI SDK. Supports deep research on files, videos, YouTube, and web content.

## Features

- 🌐 **Web Search** — Research topics using Google Search grounding
- 📄 **File Analysis** — Analyze PDFs, images, and videos
- 🎥 **YouTube Analysis** — Analyze YouTube videos directly by URL
- 🔗 **URL Context** — Analyze web pages
- 📁 **File Search** — Query indexed document stores
- 🧠 **Thinking Mode** — Enable reasoning for complex queries

## Installation

```bash
# Clone the repo
git clone https://github.com/iamtxena/gemini-research-agent.git
cd gemini-research-agent

# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Add your API key to .env
```

## Usage

### Research Commands

```bash
# Web search
bun run dev web "What are the latest developments in AI agents?"

# Analyze a local file
bun run dev file ./document.pdf "Summarize the key points"

# Analyze a YouTube video
bun run dev youtube "https://youtube.com/watch?v=..." "What are the main topics discussed?"

# Analyze a web page
bun run dev url "https://example.com/article" "What is this article about?"

# Search a File Store
bun run dev search "fileSearchStores/my-store" "Find information about X"
```

### Store Management

```bash
# Create a File Search Store
bun run dev store create "my-research-store"

# List all stores
bun run dev store list

# Upload a file to a store
bun run dev store upload "fileSearchStores/my-store" ./document.pdf

# List documents in a store
bun run dev store docs "fileSearchStores/my-store"

# Delete a store
bun run dev store delete "fileSearchStores/my-store" --force
```

### Options

- `-m, --model <model>` — Gemini model (default: `gemini-2.5-flash`)
- `-t, --thinking <level>` — Enable thinking: `minimal`, `low`, `medium`, `high`

### Examples with Thinking

```bash
# Complex research with high thinking
bun run dev web "Compare the architectures of GPT-4 and Gemini" -t high

# Analyze code with reasoning
bun run dev file ./code.ts "Review this code for security issues" -t medium
```

## Programmatic Usage

```typescript
import { researchWeb, analyzeYouTube, researchFileStore } from 'gemini-research-agent';

// Web research
const result = await researchWeb('Latest AI news', {
  model: 'gemini-2.5-pro',
  thinkingLevel: 'high',
});
console.log(result.text);
console.log(result.sources);

// YouTube analysis
const video = await analyzeYouTube(
  'https://youtube.com/watch?v=...',
  'Summarize the key points'
);
console.log(video.text);

// File store search
const docs = await researchFileStore(
  'What does the documentation say about X?',
  'fileSearchStores/my-store'
);
console.log(docs.text);
```

## Supported File Types

- **Documents**: PDF, DOCX, TXT, Markdown
- **Images**: PNG, JPG, GIF, WebP
- **Video**: MP4, MOV
- **Code**: TypeScript, JavaScript, Python, etc.

## Models

| Model | Best For |
|-------|----------|
| `gemini-2.5-flash` | Fast responses, general use |
| `gemini-2.5-pro` | Complex reasoning, detailed analysis |
| `gemini-3-flash-preview` | Latest features, file search |
| `gemini-3-pro-preview` | Advanced reasoning |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini API key |

## License

MIT

#!/usr/bin/env node
/**
 * Gemini Research Agent CLI
 */

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import {
  researchWeb,
  researchFileStore,
  analyzeFile,
  analyzeYouTube,
  analyzeUrl,
} from './agent.js';
import {
  createStore,
  listStores,
  deleteStore,
  uploadFile,
  listDocuments,
} from './store.js';

dotenv.config();

const program = new Command();

program
  .name('research')
  .description('AI-powered research agent using Gemini')
  .version('0.1.0');

// Research commands
program
  .command('web <query>')
  .description('Research a topic using Google Search grounding')
  .option('-m, --model <model>', 'Gemini model to use', 'gemini-2.5-flash')
  .option('-t, --thinking <level>', 'Thinking level: minimal, low, medium, high')
  .action(async (query, options) => {
    try {
      const result = await researchWeb(query, {
        model: options.model,
        thinkingLevel: options.thinking,
      });
      console.log('\n📝 Research Result:\n');
      console.log(result.text);
      if (result.sources?.length) {
        console.log('\n📚 Sources:');
        result.sources.forEach((s) => console.log(`  • ${s.title || s.url}`));
      }
      if (result.reasoning) {
        console.log('\n🧠 Reasoning:', result.reasoning);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('file <filepath> <query>')
  .description('Analyze a local file (PDF, image, video)')
  .option('-m, --model <model>', 'Gemini model to use', 'gemini-2.5-flash')
  .option('-t, --thinking <level>', 'Thinking level: minimal, low, medium, high')
  .action(async (filepath, query, options) => {
    try {
      const result = await analyzeFile(filepath, query, {
        model: options.model,
        thinkingLevel: options.thinking,
      });
      console.log('\n📝 Analysis Result:\n');
      console.log(result.text);
      if (result.reasoning) {
        console.log('\n🧠 Reasoning:', result.reasoning);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('youtube <url> <query>')
  .description('Analyze a YouTube video')
  .option('-m, --model <model>', 'Gemini model to use', 'gemini-2.5-flash')
  .option('-t, --thinking <level>', 'Thinking level: minimal, low, medium, high')
  .action(async (url, query, options) => {
    try {
      const result = await analyzeYouTube(url, query, {
        model: options.model,
        thinkingLevel: options.thinking,
      });
      console.log('\n📝 Video Analysis:\n');
      console.log(result.text);
      if (result.reasoning) {
        console.log('\n🧠 Reasoning:', result.reasoning);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('url <url> <query>')
  .description('Analyze a web page using URL Context')
  .option('-m, --model <model>', 'Gemini model to use', 'gemini-2.5-flash')
  .option('-t, --thinking <level>', 'Thinking level: minimal, low, medium, high')
  .action(async (url, query, options) => {
    try {
      const result = await analyzeUrl(url, query, {
        model: options.model,
        thinkingLevel: options.thinking,
      });
      console.log('\n📝 URL Analysis:\n');
      console.log(result.text);
      if (result.sources?.length) {
        console.log('\n📚 Sources:');
        result.sources.forEach((s) => console.log(`  • ${s.title || s.url}`));
      }
      if (result.reasoning) {
        console.log('\n🧠 Reasoning:', result.reasoning);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('search <store> <query>')
  .description('Search a File Search Store')
  .option('-m, --model <model>', 'Gemini model to use', 'gemini-2.5-flash')
  .option('-t, --thinking <level>', 'Thinking level: minimal, low, medium, high')
  .action(async (store, query, options) => {
    try {
      const result = await researchFileStore(query, store, {
        model: options.model,
        thinkingLevel: options.thinking,
      });
      console.log('\n📝 Search Result:\n');
      console.log(result.text);
      if (result.sources?.length) {
        console.log('\n📚 Sources:');
        result.sources.forEach((s) => console.log(`  • ${s.title || s.url}`));
      }
      if (result.reasoning) {
        console.log('\n🧠 Reasoning:', result.reasoning);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

// Store management commands
const storeCmd = program.command('store').description('Manage File Search Stores');

storeCmd
  .command('create <name>')
  .description('Create a new File Search Store')
  .action(async (name) => {
    try {
      await createStore(name);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

storeCmd
  .command('list')
  .description('List all File Search Stores')
  .action(async () => {
    try {
      await listStores();
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

storeCmd
  .command('delete <name>')
  .description('Delete a File Search Store')
  .option('-f, --force', 'Force delete even if not empty')
  .action(async (name, options) => {
    try {
      await deleteStore(name, options.force);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

storeCmd
  .command('upload <store> <filepath>')
  .description('Upload a file to a File Search Store')
  .option('-n, --name <name>', 'Display name for the file')
  .option('--chunk-size <size>', 'Max tokens per chunk', '500')
  .option('--overlap <tokens>', 'Max overlap tokens', '50')
  .action(async (store, filepath, options) => {
    try {
      await uploadFile(filepath, {
        storeName: store,
        displayName: options.name,
        chunkingConfig: {
          maxTokensPerChunk: parseInt(options.chunkSize),
          maxOverlapTokens: parseInt(options.overlap),
        },
      });
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

storeCmd
  .command('docs <store>')
  .description('List documents in a File Search Store')
  .action(async (store) => {
    try {
      await listDocuments(store);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse();

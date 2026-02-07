/**
 * File Search Store Management
 * Uses @google/genai for store operations
 */

import { GoogleGenAI } from '@google/genai';
import type { FileUploadOptions } from './types.js';

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
  }
  return ai;
}

/**
 * Create a new File Search Store
 */
export async function createStore(displayName: string): Promise<string> {
  const client = getClient();
  const store = await client.fileSearchStores.create({
    config: { displayName },
  });
  console.log(`✅ Created store: ${store.name}`);
  return store.name!;
}

/**
 * List all File Search Stores
 */
export async function listStores(): Promise<void> {
  const client = getClient();
  const stores = await client.fileSearchStores.list();
  console.log('\n📁 File Search Stores:\n');
  for await (const store of stores) {
    console.log(`  • ${store.displayName} (${store.name})`);
  }
}

/**
 * Delete a File Search Store
 */
export async function deleteStore(name: string, force = false): Promise<void> {
  const client = getClient();
  await client.fileSearchStores.delete({
    name,
    config: { force },
  });
  console.log(`🗑️  Deleted store: ${name}`);
}

/**
 * Upload a file to a File Search Store
 */
export async function uploadFile(
  filePath: string,
  options: FileUploadOptions
): Promise<void> {
  const client = getClient();

  console.log(`📤 Uploading ${filePath} to ${options.storeName}...`);

  let operation = await client.fileSearchStores.uploadToFileSearchStore({
    file: filePath,
    fileSearchStoreName: options.storeName,
    config: {
      displayName: options.displayName || filePath.split('/').pop(),
      ...(options.chunkingConfig && {
        chunkingConfig: {
          whiteSpaceConfig: {
            maxTokensPerChunk: options.chunkingConfig.maxTokensPerChunk || 500,
            maxOverlapTokens: options.chunkingConfig.maxOverlapTokens || 50,
          },
        },
      }),
      ...(options.metadata && {
        customMetadata: Object.entries(options.metadata).map(([key, value]) => ({
          key,
          ...(typeof value === 'string'
            ? { stringValue: value }
            : { numericValue: value }),
        })),
      }),
    },
  });

  // Wait for indexing to complete
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    operation = await client.operations.get({ operation });
    process.stdout.write('.');
  }

  console.log('\n✅ File uploaded and indexed!');
}

/**
 * List documents in a File Search Store
 */
export async function listDocuments(storeName: string): Promise<void> {
  const client = getClient();
  const documents = await client.fileSearchStores.documents.list({
    parent: storeName,
  });

  console.log(`\n📄 Documents in ${storeName}:\n`);
  for await (const doc of documents) {
    console.log(`  • ${doc.displayName} (${doc.name})`);
  }
}

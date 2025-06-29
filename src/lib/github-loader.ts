import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from '@langchain/core/documents';
import { summariseCode, generateEmbedding } from './gemini';
import { db } from '@/server/db';

import fetch from 'node-fetch';

// --- Get default branch ---
async function getDefaultBranch(githubUrl: string, githubToken?: string): Promise<string> {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)(\/|$)/);
  if (!match) throw new Error(`Invalid GitHub URL: ${githubUrl}`);

  const owner = match[1];
  const repo = match[2];

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(githubToken && { Authorization: `token ${githubToken}` }),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get default branch: ${error}`);
  }

  const data = await res.json();
  return data.default_branch || 'main';
}

// --- Load GitHub Repo ---
export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
  const branch = await getDefaultBranch(githubUrl, githubToken);
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || '',
    branch,
    ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 5,
  });

  return await loader.load();
};

// --- Main Indexing Function ---
export default async function indexGithubRepo(projectId: string, githubUrl: string, githubToken?: string) {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      console.log(`processing ${index + 1} of ${allEmbeddings.length}`);
      if (!embedding) return;

      const vectorLength = embedding.embedding.length;
      const vectorQuery = `[${embedding.embedding.join(',')}]`;

      // Create base record first
      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          filename: embedding.fileName,
          projectId,
        },
      });

      // Update correct vector column
      if (vectorLength === 3072) {
        await db.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "embedding3072" = ${embedding.embedding}::vector
          WHERE "id" = ${sourceCodeEmbedding.id}
        `;
      } else if (vectorLength === 768) {
        await db.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "embedding768" = ${embedding.embedding}::vector
          WHERE "id" = ${sourceCodeEmbedding.id}
        `;
      } else {
        throw new Error(`Unsupported embedding length: ${vectorLength}`);
      }
    })
  );
}

// --- Generate Embeddings ---
const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summariseCode(doc);
      const embedding = await generateEmbedding(summary);

      return {
        summary,
        embedding, // could be 768 or 3072
        sourceCode: doc.pageContent.replace(/\u0000/g, ''),
        fileName: doc.metadata.source,
      };
    })
  );
};

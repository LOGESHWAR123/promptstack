import { Document } from "@langchain/core/documents";
import { Ollama } from "@langchain/community/llms/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

const model = new Ollama({
  model: "llama3.2", 
  baseUrl: "http://localhost:11434",
  temperature: 0
});

const embeddingModel = new OllamaEmbeddings({
  model: "llama3.2",
  baseUrl: "http://localhost:11434"
});

export const aisummariseCommit = async (diff: string) => {
  const prompt = `
You are an experienced programmer, and you are trying to summarize a git diff.

Reminders about the git diff format:
For every file, there are a few metadata lines, for example:

diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js

This means that lib/index.js was modified in this commit. Note that this is only an example.

Then there is a specifier of the lines that were modified:
- A line starting with + means that line was added.
- A line starting with - means that line was deleted.
- A line that starts with neither + nor - is code shown for context and better understanding. It is not part of the change itself.

How to summarize:
- Write clear, concise bullet points describing the changes.
- Each bullet should mention what was added, removed, or modified, and if possible, why.
- Mention filenames in square brackets when relevant.
- If the same kind of change affects many files, you can summarize without listing them all.
- Do not copy raw code lines into the summary.
- Use short, professional phrasing.
- Most commits will have only a few bullet points.

Important:
Do not include any parts of the examples above in your summary. They are provided only to illustrate the expected style and level of detail.

Task:
Please analyze the following git diff and produce a bullet-point summary in the style above.

Here is the git diff:

${diff}
`;

  const response = await model.call(prompt);
  return response.trim();
};

export async function summariseCode(doc: Document) {
  console.log("Getting summary for:", doc.metadata.source);

  const code = doc.pageContent.slice(0, 1000);
  const prompt = `
You are a senior software engineer specializing in onboarding junior developers.

Your task is to help a new team member understand the following code file.

File: ${doc.metadata.source}

Code:
${code}

Write a clear, concise summary (max 100 words) explaining:
  - What this code does
  - Why it exists in the project

The explanation should be easy to understand for a junior developer familiar with basic programming but new to this codebase.
`;

  const response = await model.call(prompt);
  return response.trim();
}

export async function generateEmbedding(summary: string) {
  const embedding = await embeddingModel.embedQuery(summary);
  return embedding;
}

'use server';
import { createStreamableValue } from 'ai/rsc';
import { db } from '@/server/db';
import { Ollama } from '@langchain/community/llms/ollama';
import { generateEmbedding } from '@/lib/gemini';

const model = new Ollama({
  model: 'llama3.2',
  baseUrl: 'http://localhost:11434',
  temperature: 0,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  // Get the embedding
  const queryVector = await generateEmbedding(question);
  const vectorLength = queryVector.length;

  // Decide which column to query
  let embeddingColumn: string;
  if (vectorLength === 3072) {
    embeddingColumn = `"embedding3072"`;
  } else if (vectorLength === 768) {
    embeddingColumn = `"embedding768"`;
  } else {
    throw new Error(`Unsupported embedding dimension: ${vectorLength}`);
  }

  const vectorQuery = `[${queryVector.join(',')}]`;

  // Query the correct embedding column
  const result = await db.$queryRawUnsafe(`
    SELECT "filename", "sourceCode", "summary",
      1 - (${embeddingColumn} <=> $1::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE ${embeddingColumn} IS NOT NULL
      AND 1 - (${embeddingColumn} <=> $1::vector) > 0.5
      AND "projectId" = $2
    ORDER BY similarity DESC
    LIMIT 10
  `, vectorQuery, projectId) as { filename: string; sourceCode: string; summary: string }[];

  let context = '';
  for (const doc of result) {
    context += `source: ${doc.filename}\ncode content: ${doc.sourceCode}\nsummary: ${doc.summary}\n\n`;
  }

  console.log("context" + context);

  const prompt = `
You are an AI code assistant who answers questions about the codebase.
Your target audience is a technical intern.

AI Assistant traits: expert knowledge, helpfulness, cleverness, articulateness.
Always friendly, kind, inspiring, vivid, and thoughtful.

If the question is about code or a file, provide step-by-step instructions and clear reasoning.

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

START QUESTION
${question}
END OF QUESTION

If the context does not provide the answer, say:
"I'm sorry, but I don't know the answer to that based on the information provided."

Answer in Markdown with code snippets if needed. Be as detailed as possible.
`.trim();

  // Start streaming
  (async () => {
    const response = await model.stream(prompt);
    for await (const chunk of response) {
      stream.update(chunk);
    }
    stream.done();
  })();

  return {
    Output: stream.value,
    filesReferences: result,
  };
}

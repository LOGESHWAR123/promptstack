# 🚀 PromptStack

**PromptStack** is a modern, full-stack platform designed to supercharge collaborative software development. It brings together GitHub repository analysis, team management, meeting transcription, and AI-powered Q&A—helping teams onboard, document, and understand their codebases faster.

---

## ✨ Features

- **🔗 GitHub Integration:**  
  Connect your project to a GitHub repository. Automatically index files, summarize code, and track commits.

- **🤖 AI-Powered Q&A:**  
  Ask questions about your codebase and get context-aware answers using advanced language models and semantic search.

- **👥 Team Management:**  
  Invite team members, manage roles, and view contributors.

- **🎤 Meeting Upload & Processing:**  
  Upload meeting audio files, transcribe, and summarize discussions. Link meeting notes to code and issues.

- **📜 Commit Log:**  
  View recent commits, summaries, and author details directly in your dashboard.

- **📦 Project Archiving:**  
  Archive projects when they're no longer active.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Radix UI, Tailwind CSS  
- **Backend:** tRPC, Prisma, PostgreSQL (with pgvector for embeddings)  
- **Authentication:** Clerk  
- **AI & Embeddings:** Ollama (local), OpenAI, or Perplexity (cloud, configurable)  
- **Other:** Sonner (notifications), React Query, Axios

---

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/promptstack.git
cd promptstack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and set the following:

```env
DATABASE_URL=your_postgres_url
GITHUB_TOKEN=your_github_token
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
OPENAI_API_KEY=your_openai_key # if using OpenAI
PERPLEXITY_API_KEY=your_perplexity_key # if using Perplexity
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
```

---

## 🧑‍💻 Usage

1. **Sign Up / Sign In:**  
   Authenticate using Clerk.

2. **Create a Project:**  
   Link your GitHub repository and (optionally) provide a GitHub token for private repos.

3. **Team Collaboration:**  
   Invite team members and manage your project.

4. **Ask Questions:**  
   Use the dashboard Q&A card to ask technical questions about your codebase.

5. **Upload Meetings:**  
   Drag and drop meeting audio files to process and summarize discussions.

6. **View Commits & Summaries:**  
   See recent commits, summaries, and code references.

---

## ⚙️ Customization

- **AI Model Provider:**  
  Switch between Ollama (local), OpenAI, or Perplexity for completions and embeddings by updating `src/lib/gemini.ts`.

- **Vector Search:**  
  Uses pgvector in PostgreSQL for fast semantic search. You can swap for Pinecone or Qdrant if needed.

## 📄 License

MIT

## 🙏 Acknowledgements

- [LangChain](https://github.com/langchain-ai/langchain)
- [Clerk](https://clerk.com/)
- [Ollama](https://ollama.com/)
- [OpenAI](https://openai.com/)
- [Perplexity](https://www.perplexity.ai/)
- [Radix UI](https://www.radix-ui.com/)
- [Sonner](https://sonner.emilkowal.ski/)

---

**PromptStack** helps your team ship faster by making your codebase searchable, understandable, and

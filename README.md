# 🚀 Antigravity AI Dashboard

A premium, full-stack AI workspace built with **Next.js 15**, **Groq**, **Firecrawl**, and **Prisma**.

## ✨ Features

- **🌐 Deep Search**: Autonomous web research powered by Firecrawl and LLaMA 3. Get synthesized reports with real-time links.
- **🎥 YouTube Summarizer**: Instant transcript extraction and AI-generated study notes/summaries.
- **📁 Workspace QA (RAG)**: Upload documents to custom workspaces and chat with your data using Retrieval-Augmented Generation.
- **🛡️ Admin Approval Flow**: Secure user registration with an admin panel for user management.
- **🎨 Premium UI**: Modern dark theme with glassmorphism, micro-animations, and a sleek layout.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI Models**: [Groq](https://groq.com/) (LLaMA 3)
- **Search API**: [Firecrawl](https://www.firecrawl.dev/)
- **Database**: [Prisma](https://www.prisma.io/) with Neon/PostgreSQL
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- API Keys: Groq, Firecrawl

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divyadivyak/ai-dashboard.git
   cd ai-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_postgresql_url"
   NEXTAUTH_SECRET="your_secret"
   GROQ_API_KEY="your_groq_key"
   FIRECRAWL_API_KEY="your_firecrawl_key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [kdivya19821](https://github.com/kdivya19821)

# Trox Box AI Support Chatbot Project

A production-quality website-specific customer support chatbot and administrative CMS dashboard designed specifically for **Trox Box**, a premium contemporary clothing brand. The chatbot is context-locked, responding strictly based on the approved knowledge base and FAQ database. It parses order numbers (e.g. `TRX-1002`) to fetch tracking status details in real-time, handles fallback support redirects for off-topic questions, and logs all chat histories.

---

## 🚀 Tech Stack & AI Engine
- **Framework**: Next.js 14 (App Router) & TypeScript
- **Styling**: Tailwind CSS & Lucide Icons (Vanilla CSS micro-animations)
- **Database & Auth**: Supabase (PostgreSQL with `pgvector` extension)
- **AI Integrations**: Google Gemini API via `@google/generative-ai`
  - **Embeddings**: Gemini `text-embedding-004` (producing 768-dimensional vectors)
  - **Streaming Chat**: Gemini `gemini-1.5-flash` with 0.1 low temperature for strict context adherence
- **Security**: Supabase Row Level Security (RLS) policies on all tables, gated Next.js middleware, and server-side API key containment.

---

## 📂 Project Pages Structure

### 🌐 Public Storefront Pages
1. **Public Homepage (`/`)**: High-aesthetic store featuring premium capsule collection hovers, sustainable story details, and a dynamic floating Chatbot Widget.
2. **Public Chatbot Widget (Global Component)**: Expands progressively, streams responses token-by-token using SSE, and features dynamic branding styles fetched from the database.
3. **Public About Page (`/about`)**: Complete brand heritage and manufacturing standard statements.
4. **Public Contact Page (`/contact`)**: Customer hotlines, HQ location maps, and operation hours.

### 🛡️ Administrative Gated Pages (`/admin/*`)
5. **Admin Login Page (`/admin/login`)**: Glassmorphic credential sign-in card connected to Supabase Auth.
6. **Admin Dashboard (`/admin/dashboard`)**: KPI cards (inquiries logged, active coverage, fallback rates) and live conversation logs stream.
7. **FAQ Manager (`/admin/faqs`)**: Complete searchable FAQ table with Add, Edit, and Delete modal overlays.
8. **Knowledge Base Manager (`/admin/knowledge-base`)**: Complete article manager. Adding/modifying articles automatically generates **768-dimensional vector embeddings** using Gemini API.
9. **Chatbot Settings (`/admin/settings`)**: Singleton editor to alter Bot Name, WelcomeGreetings, Fallback text, theme colors (HEX picker), and Allowed Topics tags list array.
10. **Conversation Logs (`/admin/conversations`)**: Transcript reader modal displaying precise user questions, bot replies, session ids, and fallback alerts.
11. **Sample Orders Manager (`/admin/orders`)**: Table to CRUD mock e-commerce orders (TRX-1001 to TRX-1005) to test chatbot parsing capabilities.
12. **Test Chatbot Playground (`/admin/test`)**: Inline chatbot testing sandbox containing parameter feeds and session reset triggers.

---

## 🛠️ Step-by-Step Installation & Setup

### 1. Database Setup (Supabase Console)
1. Create a new project in your **Supabase Dashboard**.
2. Navigate to the **SQL Editor** in the left menu.
3. Open a new query tab, copy the contents of the database migration file located at:
   `[supabase/migrations/20260522000000_init_schema.sql](file:///c:/Users/dania/Downloads/New%20folder%20(4)/supabase/migrations/20260522000000_init_schema.sql)`
4. Paste it and click **Run**. This will:
   - Enable the `vector` extension.
   - Create all 6 tables (`profiles`, `chatbot_settings`, `faqs`, `knowledge_base`, `demo_orders`, `conversations`).
   - Create the cosine similarity vector search function `match_knowledge_base`.
   - Enable RLS policies on all tables.
   - Insert default settings, 5 active FAQs, 5 mock orders, and sizing guides.

### 2. Configure Environment Variables
1. At the root of your project, duplicate the `.env.example` file and rename it to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and populate the values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (from Project Settings -> API).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anon key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase private service role key (**KEEP SECRET - SERVER-ONLY**).
   - `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.

### 3. Build & Run Locally
Open your terminal in the workspace directory and execute:

```bash
# 1. Install dependencies
npm install

# 2. Run local Next.js development server
npm run dev
```

Your app will be running at `http://localhost:3000`.

---

## 🛡️ Creating Admin User
To access the gated `/admin/*` control panel, you need to register a user credentials account inside Supabase:
1. Navigate to **Authentication** -> **Users** inside your Supabase Console.
2. Click **Add User** -> **Create User**.
3. Input the admin email (e.g. `admin@troxbox.com`) and password.
4. Go to the SQL Editor and insert a matching profile role row to give this user admin rights:
   ```sql
   INSERT INTO profiles (id, email, role)
   VALUES ('YOUR-USER-UUID-FROM-USERS-TABLE', 'admin@troxbox.com', 'admin');
   ```
5. You can now login at `http://localhost:3000/admin/login` using these credentials!

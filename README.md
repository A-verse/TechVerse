# TechVerse

> A full-stack virtual conference platform built with Next.js, React, TypeScript, and Supabase.

TechVerse provides a complete digital conference experience with attendee registration, personalized tickets, schedules, speaker profiles, sponsors, and career opportunities.

## ✨ Features

- Responsive conference landing page
- Attendee registration
- Secure HTTP-only sessions
- Personalized digital tickets
- Shareable ticket pages
- Conference schedules and stages
- Speaker profiles and session details
- Sponsor showcase
- Career/job listings
- Production security headers
- Server-side validation
- Deployment-safe fallback data
- Optional GitHub OAuth, DatoCMS, 100ms, and hCaptcha integrations

## 🛠️ Tech Stack

| Category              | Technology                             |
| --------------------- | -------------------------------------- |
| Framework             | Next.js 14                             |
| Frontend              | React 18                               |
| Language              | TypeScript                             |
| Styling               | CSS Modules + Tailwind CSS             |
| Database              | Supabase                               |
| Authentication        | HTTP-only sessions                     |
| Optional Integrations | DatoCMS, GitHub OAuth, 100ms, hCaptcha |
| Deployment            | Vercel                                 |

## 📁 Project Structure

```text
TechVerse/
├── components/          # Reusable React components
├── lib/                 # Application logic, types and integrations
├── pages/               # Pages and API routes
├── public/              # Static assets
├── media/               # Event media
├── styles/              # Global styles
├── .env.example         # Environment variables template
├── next.config.js       # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase project for persistent data

Check your versions:

```bash
node --version
pnpm --version
```

### Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd TechVerse
```

Install dependencies:

```bash
pnpm install
```

Create your environment file:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS/Linux:**

```bash
cp .env.example .env.local
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## 🔐 Environment Variables

Create `.env.local` in the project root.

### Supabase

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_SECRET=
EMAIL_TO_ID_SECRET=
```

The Supabase service-role secret is **server-only** and must never use a `NEXT_PUBLIC_*` variable.

Database schema:

```text
lib/db-providers/supabase/schema.sql
```

### Site Configuration

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_ORIGIN=http://localhost:3000
NEXT_PUBLIC_REPO_URL=
```

For production, replace the localhost URLs with your deployed domain.

### Optional Integrations

```env
DATOCMS_READ_ONLY_API_TOKEN=

NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=

NEXT_PUBLIC_HMS_TOKEN_ENDPOINT=
NEXT_PUBLIC_HMS_INIT_PEER_ENPOINT=
NEXT_PUBLIC_LIVE_DEMO=false

NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET_KEY=
```

These integrations are optional. The core application can run without them using local fallback data where supported.

## 🗄️ Database

Supabase is used as the persistent backend.

Apply the schema from:

```text
lib/db-providers/supabase/schema.sql
```

to your Supabase project before using production persistence.

## 🧪 Scripts

Start development:

```bash
pnpm dev
```

Run production build:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

Run TypeScript checks:

```bash
pnpm typecheck
```

## 🚢 Deployment

TechVerse can be deployed to Vercel or another Node.js-compatible hosting provider.

For Vercel:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variables.
4. Deploy.

Recommended commands:

```text
Install Command: pnpm install
Build Command: pnpm build
Start Command: pnpm start
```

For production:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_ORIGIN=https://your-domain.com
```

Never commit:

```text
.env.local
node_modules/
.next/
```

## 📱 Responsive Design

TechVerse is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The interface includes responsive layouts for navigation, schedules, speaker cards, sponsor sections, and ticket pages.

## 🔒 Security

- HTTP-only session cookies
- Server-side secret handling
- Environment-based configuration
- Production security headers
- TypeScript strict mode
- Server-side API validation
- No client-side exposure of server credentials
- Graceful handling of unavailable optional services

## 🎯 Project Highlights

TechVerse demonstrates:

- Full-stack Next.js development
- React and TypeScript
- Supabase integration
- Authentication and session handling
- API development
- Responsive UI design
- Server-side validation
- External service integrations
- Production deployment

## 🔮 Future Improvements

- QR-based ticket check-in
- Real-time attendee interactions
- Event notifications
- Speaker dashboard
- Sponsor management
- Admin analytics
- Live-stage moderation

## 📄 License

This project is licensed under the **MIT License**.

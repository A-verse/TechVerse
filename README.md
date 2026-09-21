<!-- Hero Section -->

<div align="center">

  <img src="./public/techverse-logo.png" alt="TechVerse Logo" width="180" />

  <h1>TechVerse</h1>

  <p>
    <strong>Where ideas meet, people connect, and innovation takes the stage.</strong>
  </p>

  <p>
    A full-stack virtual conference experience built for the next generation of events.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Get Started</a> •
    <a href="#-deployment">Deployment</a>
  </p>

</div>

---

TechVerse is a digital conference platform that brings together attendees, speakers, sponsors, and career opportunities in one place. Explore sessions, access personalized tickets, and join live stages through a seamless event experience.

## ✨ Features

- Responsive conference landing page
- Attendee registration
- Secure HTTP-only session authentication
- Personalized digital tickets
- Shareable ticket pages
- Conference schedules and stages
- Speaker profiles and session details
- Sponsor showcase
- Career and job listings
- Production security headers
- Server-side validation
- Deployment-safe fallback data
- Optional GitHub OAuth integration
- Optional DatoCMS integration
- Optional LiveKit integration
- Optional hCaptcha integration

## 🛠️ Tech Stack

| Category              | Technology                      |
| --------------------- | ------------------------------- |
| Framework             | Next.js 14                      |
| Frontend              | React 18                        |
| Language              | TypeScript                      |
| Styling               | CSS Modules + Tailwind CSS      |
| Database              | Supabase                        |
| Authentication        | HTTP-only sessions              |
| Live Communication    | LiveKit                         |
| Optional Integrations | DatoCMS, GitHub OAuth, hCaptcha |
| Deployment            | Vercel                          |

## 📁 Project Structure

```text
TechVerse/
├── components/              # Reusable React components
├── lib/                     # Application logic, types and integrations
├── pages/                   # Pages and API routes
├── public/                  # Static assets
├── media/                   # Event media
├── styles/                  # Global styles
├── .env.example             # Environment variables template
├── next.config.js           # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20+
- pnpm
- A Supabase project for persistent production data

Check your installed versions:

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

Create the local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux:**

```bash
cp .env.example .env.local
```

Start the development server:

```bash
pnpm dev
```

Open the application at:

```text
http://localhost:3000
```

## 🔐 Environment Variables

Create a `.env.local` file in the project root.

### Supabase

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_SECRET=
EMAIL_TO_ID_SECRET=
```

The Supabase service-role secret is **server-only** and must never be exposed through a `NEXT_PUBLIC_*` environment variable.

The database schema is located at:

```text
lib/db-providers/supabase/schema.sql
```

### Site Configuration

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_ORIGIN=http://localhost:3000
NEXT_PUBLIC_REPO_URL=
```

For production, replace the localhost values with the deployed application domain.

## 🎥 Live Stage Authentication

Stage pages require a valid TechVerse session.

If a signed-out user opens a stage URL directly, they are redirected to the home registration screen. After submitting their registered email, they can be returned to the requested stage.

Live-stage permissions are handled server-side:

| Role      | Permissions                                                          |
| --------- | -------------------------------------------------------------------- |
| Viewer    | Subscribe-only access with no camera, microphone, or data publishing |
| Speaker   | Viewer permissions plus camera, microphone, and data publishing      |
| Moderator | Speaker permissions plus LiveKit room administration                 |

Moderator access is restricted to the emails configured through `LIVEKIT_MODERATOR_EMAILS`.

The LiveKit token endpoint also accepts only the three configured TechVerse stage room names.

## 🎙️ LiveKit Live Stages

TechVerse uses LiveKit for real-time live stages.

Create a LiveKit Cloud project and configure the following environment variables:

```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud

LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

NEXT_PUBLIC_LIVEKIT_ROOM_A=techverse-stage-a
NEXT_PUBLIC_LIVEKIT_ROOM_C=techverse-stage-c
NEXT_PUBLIC_LIVEKIT_ROOM_M=techverse-stage-m
```

The browser never receives the LiveKit API secret.

The Next.js API route:

```text
/api/livekit-token
```

creates short-lived participant tokens on the server.

Viewer tokens provide subscribe-only access, while speaker tokens allow audio and video publishing.

## 🔌 Optional Integrations

TechVerse supports several optional integrations:

```env
DATOCMS_READ_ONLY_API_TOKEN=

NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=

NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET_KEY=
```

These integrations are optional:

- DatoCMS
- GitHub OAuth
- hCaptcha

Supabase is required for production persistence.

## 🗄️ Database

Supabase is used as the persistent backend for TechVerse.

The database schema can be found at:

```text
lib/db-providers/supabase/schema.sql
```

Apply this schema to your Supabase project before enabling production persistence.

## 🧪 Available Scripts

### Development

```bash
pnpm dev
```

Starts the Next.js development server.

### Production Build

```bash
pnpm build
```

Creates an optimized production build.

### Production Server

```bash
pnpm start
```

Starts the production application.

### Type Checking

```bash
pnpm typecheck
```

Runs the TypeScript type checker.

## 🚢 Deployment

TechVerse can be deployed to Vercel or another Node.js-compatible hosting provider.

### Deploying with Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.

Recommended configuration:

```text
Install Command: pnpm install
Build Command: pnpm build
Start Command: pnpm start
```

For production, configure:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_ORIGIN=https://your-domain.com
```

Never commit sensitive or generated files such as:

```text
.env.local
node_modules/
.next/
```

## 📱 Responsive Design

TechVerse is designed to provide a consistent experience across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive layouts are implemented across major areas of the platform, including:

- Navigation
- Conference schedules
- Speaker cards
- Sponsor sections
- Ticket pages
- Event content

## 🔒 Security

TechVerse incorporates several security-focused practices:

- HTTP-only session cookies
- Server-side secret handling
- Environment-based configuration
- Production security headers
- TypeScript strict mode
- Server-side API validation
- No client-side exposure of server credentials
- Graceful handling of unavailable optional services
- Server-side LiveKit token generation
- Role-based permissions for live stages

## 🎯 Project Highlights

TechVerse demonstrates practical full-stack development across:

- Next.js application development
- React and TypeScript
- Supabase backend integration
- Authentication and session management
- API route development
- Server-side validation
- Responsive UI development
- Real-time communication with LiveKit
- External service integrations
- Production-oriented security practices
- Deployment configuration

## 🔮 Future Improvements

Potential improvements include:

- QR-based ticket check-in
- Real-time attendee interactions
- Event notifications
- Speaker dashboard
- Sponsor management
- Admin analytics
- Enhanced live-stage moderation

## 📄 License

This project is licensed under the **MIT License**.

 <p align="center">
  <img src="public/favicon.ico" alt="TechVerse Logo" width="150" />
</p>

<h1 align="center">TechVerse</h1>

<p align="center">
  <strong>Virtual Events • Live Experiences • Career Opportunities</strong>
</p>

<p align="center">
  A virtual event platform that brings live stages, speaker sessions,<br/>
  event schedules, interactive expo experiences, and career opportunities<br/>
  together in one connected digital destination.
</p>

<p align="center">
  <a href="https://github.com/YOUR_USERNAME/YOUR_REPOSITORY">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,supabase,postgres,git,github,vercel&perline=9" alt="Tech Stack Icons" />
</p>

---

## ✨ Highlights

<table>
<tr>
<th align="left">🎤 Events</th>
<th align="left">🌐 Experiences</th>
<th align="left">💼 Careers</th>
<th align="left">⚙️ Platform</th>
</tr>
<tr>
<td valign="top">

- Live stages
- Speaker sessions
- Event schedules
- Event hub

</td>
<td valign="top">

- Virtual expo
- Interactive experiences
- Live audio/video
- Responsive interface

</td>
<td valign="top">

- Career opportunities
- Job discovery
- Organization showcase

</td>
<td valign="top">

- Next.js
- TypeScript
- Supabase
- PostgreSQL
- LiveKit

</td>
</tr>
</table>

---

## 🚀 Overview

TechVerse is a virtual event platform designed to bring event experiences together in one place. Users can explore event information, browse schedules and speakers, discover expo and career opportunities, and join live stages.

The platform combines event discovery, live interaction, and career exploration into a unified digital experience.

---

## 🎯 Features

<table>
<tr>
<td width="50%" valign="top">

### 🎤 Event Experience

- **Event Hub:** Explore event sections and available content.
- **Schedule:** Browse event sessions and timing.
- **Speakers:** Discover event speakers.
- **Live Stages:** Access stage pages and join live sessions.

</td>
<td width="50%" valign="top">

### 🌐 Expo & Careers

- **Expo:** Explore expo content and participating organizations.
- **Jobs:** Browse career and job opportunities.
- **LiveKit Integration:** Supports real-time audio/video experiences.
- **Responsive UI:** Designed for desktop and mobile screens.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,supabase,postgres,git,github,vercel&perline=9" alt="Tech Stack Icons" />
</p>

<table>
<tr>
<td width="50%" valign="top">

### Frontend

- Next.js 14
- React
- TypeScript
- Tailwind CSS

### Backend & Database

- Supabase
- PostgreSQL

</td>
<td width="50%" valign="top">

### Real-Time Communication

- LiveKit
- Real-time audio/video experiences

### Deployment & Tools

- Vercel
- Git
- GitHub

</td>
</tr>
</table>

---

## 🏗️ Project Structure

```text
.
├── public/
│   └── favicon.ico
├── media/
│   ├── dashboard.png
│   ├── stage.png
│   ├── join.png
│   ├── preview.png
│   ├── ar-1.png
│   ├── ar-2.png
│   ├── as-1.png
│   ├── as-2.png
│   └── cms.png
├── src/
├── .env.example
├── package.json
└── README.md
```

_Update the structure above if your actual folders differ._

---

## ⚡ Getting Started

### Prerequisites

- Node.js
- npm
- Supabase project credentials
- LiveKit credentials for live-stage functionality

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   ```

2. Navigate to the project directory:

   ```bash
   cd YOUR_REPOSITORY
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create your environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

5. Configure the required environment variables in `.env.local`.

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000.

---

## 🔐 Environment Variables

Configure the variables required by your project in `.env.local`.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# LiveKit
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```

Use `.env.example` as the source of truth for the complete variable list. Never commit `.env.local` or expose private server-side credentials.

---

## 📜 Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Run only the scripts defined in your project's `package.json`.

---

## 🔒 Security Notes

- Keep private API keys and secrets on the server.
- Do not commit environment files containing credentials.
- Protect authenticated and role-restricted routes on the server.
- Validate access before issuing LiveKit room tokens.

---

## 🚀 Deployment

The application can be deployed to Vercel or another compatible hosting provider.

Before deployment:

1. Configure the required environment variables.
2. Verify authentication and access-control settings.
3. Test the production build.
4. Confirm live-stage functionality with valid LiveKit credentials.

---

## 📄 License

Add a license file if you intend to distribute this project under an open-source license.

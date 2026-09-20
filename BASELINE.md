# TechVerse — Baseline (Phase 0)

Recorded 2026-09-15, before any changes.

## Stack

Next.js 14.2.35 (Pages Router) + TypeScript 5.4 + Tailwind CSS. Supabase (`db-providers/supabase`)
for user/ticket data, DatoCMS (`cms-providers/dato.ts`) for content (stages, speakers, sessions,
sponsors). LiveKit (`livekit-client` / `livekit-server-sdk` / `@livekit/components-react`) for live
stages. hCaptcha for registration. GitHub OAuth for account linking.

## Routes (current)

| Route | Purpose |
|---|---|
| `/` | Landing / registration / ticket |
| `/schedule` | Session schedule |
| `/speakers`, `/speakers/[slug]` | Speaker list & profile |
| `/expo`, `/expo/[slug]` | Sponsor/expo list & detail |
| `/jobs` | Job board |
| `/stage/[slug]` | Live stage (slugs in use: `a`, `c`, `m`) |
| `/tickets/[username]`, `/ticket-image`, `/api/ticket-images/[username]` | Digital ticket + OG image |
| API: `/api/auth`, `/api/register`, `/api/github-oauth`, `/api/save-github-token`, `/api/livekit-token`, `/api/stages` | |

No `/jobs/[slug]` detail route yet (jobs list only), and no `/me`, notifications, search, or admin
routes exist yet — these are Phase 3/5/6/9/10 additions, not currently broken features.

## Auth flow (as built)

- Session identified by cookie `techverse_session` (`COOKIE` in `lib/constants.ts`), set on
  successful registration/login (`/api/register`, `/api/auth`).
- `/api/auth` (GET) validates the cookie server-side against Supabase via `getTicketNumberByUserId`
  — returns 401 for missing cookie, unregistered user, or server error. Not a client-only check.
- `pages/stage/[slug].tsx` uses `getServerSideProps` to require a valid session **before** the page
  renders — unauthenticated direct access to `/stage/a` etc. redirects to
  `/?login=1&returnTo=/stage/a`, preserving return path. This already matches the spec's required
  behavior; it is not currently a client-side bypass.
- GitHub OAuth (`/api/github-oauth`, `/api/save-github-token`) is a secondary account-linking step,
  separate from the primary session cookie.

## LiveKit flow (as built)

- `/api/livekit-token` (POST only) requires the session cookie, resolves the user server-side via
  Supabase, and rejects if missing/invalid.
- Room name is validated against an allowlist built from `NEXT_PUBLIC_LIVEKIT_ROOM_{A,C,M}` — a
  client can't request an arbitrary room.
- Moderator role is **not** trusted from the request; it's granted only if the authenticated user's
  email is in the server-only `LIVEKIT_MODERATOR_EMAILS` allowlist. `?role=moderator` alone cannot
  grant moderator or publish rights.
- Grants: viewer → subscribe only; speaker/moderator → publish + publish data; moderator only →
  `roomAdmin`.
- Client-side stage UI lives in `components/livekit/Room.tsx` and `components/livekit/Join.tsx`,
  wired into `components/stage-container.tsx`.

## Major UI areas

`components/header.tsx` + `mobile-menu.tsx` (nav), `hero.tsx`, `schedule.tsx` +
`schedule-sidebar*.tsx`, `speakers-grid.tsx` + `speaker-section.tsx`, `sponsors-grid.tsx` +
`sponsor-section.tsx`, `jobs-grid.tsx`, `ticket*.tsx` (several ticket render variants — mono,
colored, mobile, profile, image), `stage-container.tsx`, `form.tsx` (registration), `footer.tsx`.

## Baseline test results (actually run, this session)

- `pnpm install` — succeeded, 328 packages resolved, no peer/engine errors. Ignored optional
  native build scripts (`bufferutil`, `es5-ext`, `utf-8-validate`) — not required for typecheck/build.
- `pnpm typecheck` — **fails**, 2 errors, both identical:
  `Property 'message' does not exist on type 'MediaDeviceFailure'` in
  `components/hms/Room.tsx:246` and `components/livekit/Room.tsx:246`.
- `pnpm build` — **fails** at the type-checking step on the same `components/hms/Room.tsx:246`
  error (Next.js type-checks the whole project, including unimported files, during build).
- `pnpm dev` — not run yet (pending Phase 1 fix, no point starting dev server against a build that
  doesn't type-check).

## Known issues identified (not yet fixed)

1. **Build-blocking type error** in `components/livekit/Room.tsx` (real, active code) and
   `components/hms/Room.tsx` (dead code) — `MediaDeviceFailure` has no `.message` property in the
   installed `livekit-client` types.
2. **Dead 100ms/HMS code**: `components/hms/Room.tsx`, `components/hms/Join.tsx`,
   `components/icons/icon-hms.tsx` — confirmed unimported anywhere in the app, and also the source
   of one of the two build failures.
3. **No `.env.example` file** in the repo, despite ~30 env vars being referenced across the code
   (Supabase, DatoCMS, LiveKit, hCaptcha, GitHub OAuth, per-sponsor Discord/jobs URLs, etc.) — spec
   section 28 requires one; currently missing entirely.
4. `/jobs` has no detail route (`/jobs/[slug]`) despite `jobs-grid.tsx` existing — needs
   confirmation in Phase 5 whether card links already point at real per-job data or need a detail
   page added.

## Not yet audited (deferred to later phases as planned)

Responsive behavior at breakpoints, accessibility, performance, admin/networking/search (don't
exist yet — will be scoped honestly in their phases, not assumed).

---
**Phase 0 status: complete.** Build is currently red for a small, well-understood reason. Moving to
Phase 1 to fix the build, remove confirmed-dead HMS code, and finish the security/auth/env audit.

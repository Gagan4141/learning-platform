# N5 FastTrack Japanese Learning Platform

Production-ready JLPT N5 web app built with **Next.js + TypeScript + Tailwind + Prisma (SQLite)**. It provides a complete beginner-to-N5 flow for speaking, listening, writing, reading, kana/kanji basics, vocab, grammar, review, and gamified progress.

## Core Features

- **Email/password auth** with secure hashed passwords + HTTP-only session cookie.
- **Onboarding** (level, daily time budget, goal) with a personalized study plan.
- **N5 curriculum** modules for hiragana, katakana, kanji, vocabulary, grammar, reading, listening, speaking, writing.
- **Speaking practice** with browser microphone capture (Web Speech API), transcript comparison, quality scoring, and actionable feedback.
- **Listening training** with interactive game rounds, adjustable playback speed, scoring, and personal leaderboard.
- **Writing drills** with guided prompts and romaji→kana helper.
- **Reading practice** with graded passages, furigana toggle, inline word lookup, and comprehension prompts.
- **Fast-learning methods** included:
  - Spaced Repetition (SRS scheduling)
  - Active recall
  - Interleaving queue
  - Error-based review notebook
  - Adaptive difficulty
  - Streak/XP/badges progression
- **Assessments**: mini placement/onboarding flow + N5-style mini mock sections.
- **Analytics dashboard**: skill accuracy, time spent, mastered topics, due review cards, weak skill diagnostics.
- **Substantial built-in N5 content** seeded from JSON.

## Stack

- Frontend/API: Next.js App Router
- Database: Prisma + SQLite
- Auth: custom email/password + server sessions
- Validation: Zod
- Tests: Vitest

## Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

Demo seeded user:
- `demo@n5fast.jp`
- `demo12345`

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run lint` - lint app
- `npm run test` - run core logic tests (SRS/scoring/progression)
- `npm run db:push` - sync Prisma schema to SQLite
- `npm run db:seed` - seed N5 content/demo data

## Content Seeding

- Structured seed content file: `prisma/seed-content/n5-content.json`
- Seed loader: `prisma/seed.ts`

## Project Structure

- `src/app` - pages + API routes
- `src/components` - UI modules (navigation, learning workspace)
- `src/lib` - auth, prisma client, SRS/scoring/adaptive logic, onboarding, transliteration
- `prisma` - schema and seed data

## Deployment

Any Node-compatible deployment for Next.js works.

Production checklist:
- use Postgres for production-scale data
- configure HTTPS + secure cookie domain
- provide real TTS/STT service for advanced speaking/listening scoring
- add background jobs for reminders and notification nudges

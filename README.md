# Grădinița Piticot Dej

Website and content management system for Grădinița Piticot, a kindergarten in Dej, Romania. The public site shows news, the daily schedule, the team, documents and a photo gallery. Behind it is a custom admin panel that the kindergarten's staff use to publish everything themselves, with no developer involved.

**Live:** [piticotdej.ro](https://www.piticotdej.ro)

## What it does

**Public site** (`app/(site)`)
- Pages for announcements, activities, schedule, team, leadership, documents, gallery, enrolment and contact
- Incremental static regeneration: pages are served statically and refreshed when content changes
- SEO built in: sitemap, robots, Open Graph and JSON-LD for the local business and breadcrumbs

**Admin panel** (`app/admin`)
- Email and password sign-in with **role-based access**: admins manage users and site settings, editors manage content
- Rich-text editing with TipTap, image and PDF uploads, reordering and visibility toggles
- **Version history** with one-click restore on every content collection, and a preview of changes before saving
- Editing screens written in Romanian for non-technical staff

## How it works

```
Browser ──► Next.js on Vercel (fra1)
              ├─ Public pages (ISR, revalidated on content change)
              ├─ Edge middleware: verifies the admin session cookie (jose)
              └─ API routes: session, contact form (rate-limited)
                     │
                     ▼
            Firebase
              ├─ Auth (custom claims: admin / editor)
              ├─ Firestore (content, protected by validated security rules)
              ├─ Storage (images, PDFs)
              └─ Cloud Functions
                   ├─ processUploadedImage: converts uploads to WebP at 400/800/1200 px with sharp
                   ├─ version snapshots on every update and delete (restorable from the admin)
                   └─ nightlyFirestoreBackup: daily export at 03:00
```

**Security**
- Firestore and Storage rules check roles and validate every field (types, allowed keys, HTTPS-only URLs)
- Admin routes are guarded twice: in edge middleware and in the client `AdminGuard`
- User HTML is sanitised with `sanitize-html`; the contact form is rate-limited
- Optional Firebase App Check with reCAPTCHA

## Stack

Next.js 14 (App Router) · React 18 · Firebase (Auth, Firestore, Storage, Cloud Functions) · TipTap · sharp · Vercel · GitHub Actions

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in Firebase client and admin credentials
npm run dev                  # http://localhost:3000
```

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run seed:firebase` | Seeds Firestore from the JSON files in `content/` |
| `npm run seed:site` | Seeds the site settings document |
| `npm run set-role` | Gives a user the `admin` or `editor` role |
| `npm run set-password` | Sets a user's password |
| `npm run setup:backup-bucket` | Creates the bucket for nightly backups |

Deploy rules and functions with the Firebase CLI: `firebase deploy --only firestore:rules,storage,functions`.

## Project structure

```
app/(site)/        public pages
app/admin/         admin panel
app/api/           session and contact endpoints
components/admin/  editor UI: rich text, uploads, version history, previews
lib/cms/           content model, data access, revalidation
functions/         Cloud Functions: image processing, versioning, backups
scripts/           seeding and user management
```

---

Built by [Cosmin Mare](https://mare-cosmin.ro/en/).

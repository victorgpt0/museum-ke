# museum-ke

A full-stack museum management and inventory platform built with **Laravel 12** and **React 19** (via Inertia.js). It handles artifact cataloguing, donor acquisitions, archival documents, field-research projects, role-based access control, and real-time notifications — designed for a museum's back-office team to run day-to-day operations end to end.

## Features

### Inventory & Collections
- **Artifact catalogue** — create, tag, categorize, and track condition (good/poor), location, and acquisition date, with image/document attachments via Spatie Media Library.
- **Archives** — research and contextual documents (reports, PDFs, images), linkable to specific artifacts with typed relationships (conservation report, excavation notes, provenance document, etc.).
- **Acquisitions / donations** — public-facing donation proposal intake (donor + next-of-kin details, artifact images), with an approval workflow that emails donors on submission, approval, and rejection.

### Field Research & Project Management
- Project proposals with an approval pipeline (pending → approved/rejected) that auto-creates a `Project` on approval.
- Projects broken into **milestones**, each with **goals** (performance-scored 1–10), **budget line items** (amount vs. amount spent), **findings** (with documents/images), and **team members**.
- Budget and progress roll-ups computed from milestone/goal completion.

### Access Control & Auditing
- **Role-based access control** via `spatie/laravel-permission`, with per-controller middleware guarding view/create/edit/delete actions (e.g. `permission:artifacts.view`).
- Custom Artisan commands (`make:permission`, `make:permissions`) to scaffold CRUD permissions for a model in one line.
- **Activity logging** via `spatie/laravel-activitylog`, surfaced through a filterable admin log (by user, event, date range).

### Real-Time & Async
- **WebSocket notifications** via Laravel Reverb — in-app notifications broadcast live to a user's private channel (`user-notifications.{id}`) and also persisted to the database.
- **Queues** — notification and mail delivery (donor approval/rejection/submission emails) are queued rather than sent inline.
- **Redis** used for cache/queue backing in production (`phpredis` client).

### Search & Discovery
- Public **explore/search** endpoint across published artifacts, projects, and archives.
- **Laravel Scout** integrated for indexed search.
- Interactive **map** view (Leaflet/React-Leaflet) for geographically anchored records.

### Media & Documents
- Centralized **media library** admin view: browse, filter, and bulk-manage all uploaded files across the app (images, documents, video, audio) with type/collection stats and analytics.
- Per-model media collections (images/documents) with automatic thumbnail conversions.

### Other
- **Hashids** — obfuscated, non-sequential public IDs for sensitive models.
- **AI query endpoint** — a simple chat-completion proxy controller for AI-assisted workflows.
- Optimized Eloquent usage throughout: eager loading (`with()`) to avoid N+1 queries, permission-scoped queries, and paginated, query-string-preserving index endpoints across all major resources.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | Laravel 12 (PHP 8.2+) |
| Frontend framework | React 19 + TypeScript |
| Bridge | Inertia.js 2 (SSR-capable) |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI primitives |
| Build tool | Vite 6 |
| Database | PostgreSQL |
| Cache / Queue | Redis |
| Real-time | Laravel Reverb (WebSockets) + Laravel Echo / Pusher-js client |
| Auth & RBAC | Laravel's built-in auth + `spatie/laravel-permission` |
| Media | `spatie/laravel-medialibrary` |
| Activity logging | `spatie/laravel-activitylog` |
| Search | Laravel Scout |
| Testing | Pest (PHP) |
| Linting/formatting | ESLint, Prettier, Laravel Pint |
| Containerization | Docker (multi-stage build, `serversideup/php` base image) |

## Project Structure

```
app/
  Console/Commands/     # Custom artisan commands (permission scaffolding, table clearing)
  Http/Controllers/     # One controller per resource (Artifact, Acquisition, Project, Milestone, ...)
  Http/Middleware/      # Inertia sharing, appearance, header-based auth
  Mail/                 # Donor submission/approval/rejection mailables
  Models/               # Eloquent models (Artifact, Archives, Project, Milestone, Goals, Budget, ...)
  Notifications/        # Broadcast + database notification for in-app alerts
  Services/             # Supporting services (e.g. static role data)
database/
  migrations/           # Full schema history
  seeders/               # Category, permission, artifact, and demo data seeders
resources/js/
  pages/                # Inertia page components, organized by resource
  components/           # Shared UI + shadcn/ui primitives
  layouts/               # App/auth/settings layout shells
docker/                  # Nginx, PHP-FPM, and Supervisor configs used by the production image
```

## Getting Started (Local Development)

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+ / npm
- PostgreSQL (or SQLite for quick local dev — see `.env.example`)
- Redis (optional locally; required for queue/cache parity with production)

### Setup

```bash
git clone <repo-url>
cd museum-ke

composer install
npm install

cp .env.example .env
php artisan key:generate

# configure DB_* and REDIS_* in .env, then:
php artisan migrate --seed
```

### Running the app

The `composer dev` script runs the PHP server, Reverb (WebSocket server), the queue listener, the scheduler, and Vite concurrently:

```bash
composer dev
```

Or with server-side rendering:

```bash
composer dev:ssr
```

Individually:

```bash
php artisan serve             # HTTP server
php artisan reverb:start      # WebSocket server
php artisan queue:listen      # Queue worker
npm run dev                   # Vite dev server
```

### Testing & Code Quality

```bash
composer test        # Pest test suite (clears config cache first)
npm run lint          # ESLint (auto-fix)
npm run format         # Prettier
npm run types           # TypeScript check (no emit)
./vendor/bin/pint       # Laravel Pint (PHP style)
```

## Environment Variables

Key variables beyond Laravel's defaults (see `.env.example` for the full list):

| Variable | Purpose |
|---|---|
| `DB_CONNECTION`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Database connection (PostgreSQL in production) |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection for cache/queue |
| `CACHE_STORE`, `QUEUE_CONNECTION` | Set to `redis` in production |
| `BROADCAST_CONNECTION`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`, `REVERB_APP_ID`, `REVERB_HOST`, `REVERB_PORT` | WebSocket broadcasting via Reverb |
| `VITE_REVERB_APP_KEY`, `VITE_REVERB_HOST`, `VITE_REVERB_PORT`, `VITE_REVERB_SCHEME` | Frontend Echo client config (build-time) |
| `MAIL_MAILER`, `MAIL_HOST`, `MAIL_FROM_ADDRESS` | Donor notification emails |

## Deployment

A production-ready multi-stage `Dockerfile` is included:

1. **`vendor` stage** — installs Composer dependencies.
2. **`node_modules` stage** — builds frontend assets with Vite, injecting `VITE_REVERB_*` build args.
3. **`final` stage** — based on `serversideup/php:8.4-fpm`, bundles Nginx, PHP-FPM, Supervisor, and an embedded PostgreSQL instance, running everything under `supervisord` behind Nginx on port 80. Includes a container healthcheck against `/up`.

```bash
docker build -t museum-ke .
docker run -p 80:80 --env-file .env museum-ke
```

For a typical cloud deployment, run this image alongside a managed or containerized Redis instance, and either use the bundled PostgreSQL or point `DB_*` at an external database.

## License

MIT (see `composer.json`).

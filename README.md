# NCKU Study

[NCKU Study](https://nckustudy.com/) lets students browse and share major transfer and study experiences at National Cheng Kung University.

## Architecture

![Production application architecture: URLs, rendering, and caches](docs/ncku-study-production-application-urls-rendering-and-caches.svg)

The application uses **Next.js, React, TypeScript, and Tailwind CSS**. Next.js route handlers provide `/api/v2` endpoints; Auth.js protects administration; Kysely accesses MySQL.

- `/major` and `/study` use SSR with 30-second revalidation, prefetch approved records, and hydrate TanStack Query. CSR handles filters, details, and subsequent requests; public browser queries stay fresh for 60 seconds.
- Public comment and study reads use a 30-second Next.js data cache. API responses advertise `s-maxage=30` and `stale-while-revalidate=30` through `Cache-Control` headers.
- `/post` uses a client-side form to submit records for review. `/admin` uses authenticated, dynamic pages and uncached CRUD APIs.
- Production runs on an AWS EC2 instance: Route 53 resolves the domain to its public IP, Nginx proxies to the PM2-managed Next.js process, and MySQL runs locally. See [deployment details](DEPLOYMENT.md).

## Migration and bundle size

This application migrates [NCKU_Trans](https://github.com/JiaAnTW/NCKU_Trans) from Laravel/PHP, React, and styled-components to Next.js, TypeScript, and Tailwind CSS. The new version not only decreases the bundle size but also introduces new features such as SSR and ISR.

Comparision of assets size for home page (https://nckustudy.com/major):

| Asset | v2 (Laravel/PHP, React, styled-components) | v3 (Next.js + styled-components) | Change |
| --- | ---: | ---: | ---: |
| JavaScript | 4,880,093 bytes (4.65 MiB) | 711,369 bytes (695 KiB) | 85.4% smaller |
| CSS | 141,942 bytes (139 KiB) | 53,228 bytes (52 KiB) | 62.5% smaller |

## Development

Install dependencies and start the local server at [http://localhost:3000](http://localhost:3000):

```bash
npm ci
npm run dev
```

`npm run dev` uses local mock data. For a local MySQL-backed run, set `DATABASE_URL` in `.env.local` (see `.env.sample`) and use `npm run dev:uat`.

| Command | Purpose |
| --- | --- |
| `npm run lint` | Check source lint rules |
| `npm run typecheck` | Check TypeScript types |
| `npm run build` | Create a production build |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run migrate` | Apply database migrations |

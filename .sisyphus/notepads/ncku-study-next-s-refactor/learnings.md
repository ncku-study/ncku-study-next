 - Added Tailwind v4 CSS-only utilities directly in globals.css without touching config.
 - Reference UI scrollbar utilities and slide-in animations can be copied verbatim into @layer utilities.
  - Auth route handlers can read sessions via uth() and verify credentials with getUserRepository() before returning the mock emember_token contract.
2026-05-24: package.json scripts must be kept aligned with the plan spec exactly; `dev:uat` replaces `dev:db`, `prod` can be `next build && next start`, and `cross-env` is already present in devDependencies.

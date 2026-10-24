# Website development instructions
Read [ui-spec.yaml](./ui-spec.yaml) before changing any interface. These are binding decisions for design tokens, reusable patterns, layout breakpoints, keyboard and touch behavior, motion and quality gates.
Use the official HorizonX Vibe Coding UI Specification v1.0 as the underlying methodology; the project spec contains the concrete choices.
Preserve all routes, researched sources, legal/editorial disclosures, profile status, `src/site-config.mjs`, Cloudflare Pages build and existing test coverage.
Do not introduce heavy frontend dependencies or claim QA without checks. Public crawling and indexing of the existing Cloudflare Pages website were authorized 16 October 2026. The approved canonical domain is **https://mag.bahamasaisolutions.com/**. Never switch canonicals or sitemap entries to `pages.dev`, or change domains without new approval; avoid unsupported rankings. See [docs/SEO-DOMAIN.md](./docs/SEO-DOMAIN.md) for redirection, metadata and verification. See [docs/HORIZONX-QA.md](./docs/HORIZONX-QA.md).

## Living Atlas v2

Use `src/living-atlas.mjs`, `src/page-mosaics.mjs`, `public/living-atlas.css` and `public/living-atlas.js` for the active interactive design. Never replace real island switchers, story rail controls, command search, or industry filters with decorative inert buttons. Preserve `prefers-reduced-motion`, no-JavaScript readable content, documented company image provenance and photo permission status. Production site is on `main`; test changes on a branch and verify Cloudflare after authorization. Run `npm run build`, `npm test`, and `npm run qa:browser` (Chromium required). For photo sources see `docs/PHOTO-SOURCES.md`.

## Public editorial standards

Tranquilitas is publisher-affiliated and may receive clearly labeled, prominent promotional placement. Never imply its promotion is an independent regional award or #1 ranking without defensible comparative evidence. Preserve sourced regional profiles, eight-market navigation, canonical URLs and sitemap. Show unknown company identity and in-development status clearly.

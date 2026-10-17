# Website development instructions
Read [ui-spec.yaml](./ui-spec.yaml) before changing any interface. These are binding decisions for design tokens, reusable patterns, layout breakpoints, keyboard and touch behavior, motion and quality gates.
Use the official HorizonX Vibe Coding UI Specification v1.0 as the underlying methodology; the project spec contains the concrete choices.
Preserve all routes, researched sources, legal/editorial disclosures, profile status, Cloudflare Pages build and existing test coverage.
Do not introduce heavy frontend dependencies or claim QA without checks. No production custom domain or indexing without approval. See [docs/HORIZONX-QA.md](./docs/HORIZONX-QA.md).

## Living Atlas v2

Use `src/living-atlas.mjs`, `src/page-mosaics.mjs`, `public/living-atlas.css` and `public/living-atlas.js` for the active interactive design. Never replace real island switchers, story rail controls, command search, or industry filters with decorative inert buttons. Preserve `prefers-reduced-motion`, no-JavaScript readable content, documented company image provenance and photo permission status. Preview branch `design/living-atlas-swagv2`; no merge until founder review. Run `npm run build`, `npm test`, and `npm run qa:browser` (Chromium required). For photo sources see `docs/PHOTO-SOURCES.md`.

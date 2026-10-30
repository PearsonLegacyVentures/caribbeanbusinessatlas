# Caribbean Business Atlas

**Standalone Caribbean business publication. Public directory and journal.**

Repository: `PearsonLegacyVentures/caribbeanbusinessatlas`

## Site

The current static generator produces **43 pages** from 21 researched/provisional company records and 14 editorial pieces, plus a custom 404. Routes: `/`, `/stories/`, `/stories/{slug}/`, `/directory/`, `/directory/{slug}/`, `/islands/`, `/about/`, `/submit/`, `/editorial-policy/`, and `/privacy/`.

The directory supports live company search plus country and industry filters. Each profile distinguishes established operations from pre-commercial, in-development and identity-verification status. Source links accompany evidence-backed entries. Information supplied by companies is distinguished from independent reporting.

**Public indexing authorized 16 October 2026.** Pages are intended to be indexable on `https://mag.bahamasaisolutions.com/`, with canonical URLs and a generated sitemap. The inactive submission page is omitted from the sitemap.

## Run locally

Node.js 22+, no third-party npm installation required:

```sh
npm run build
npm test
npm run qa:browser # requires a locally installed Chromium-family browser
npm run editorial:brief
npx serve dist
```

Build output is `dist/`; Cloudflare Pages Functions are in `functions/`.

## Source structure

- `src/data.mjs`: business profiles and articles, including original source references.
- `scripts/generate.mjs`: static publication renderer, metadata and internal routes.
- `public/styles.css`: responsive editorial design.
- `public/app.js`: search, country/sector filtering, mobile navigation and submission flow.
- `functions/api/submissions.js`: protected Cloudflare Pages endpoint.
- `tests/`: site structure and API validation tests.
- `scripts/editorial-brief.mjs`: creates an **unpublished** editorial research brief.
- `docs/RESEARCH.md`: evidence register and verification issues.
- `docs/EDITORIAL_WORKFLOW.md`: editorial process, sourcing and publishing gates.
- `.github/workflows/`: test-only workflow and manual-only draft workflow, **no deploy jobs**.

## Submissions

Business nominations are intentionally not collected in review mode. After owner approval, create a new Cloudflare Pages project and configure:

1. Cloudflare KV binding `SUBMISSIONS` for the Pages Function.
2. Encrypted runtime secret `TURNSTILE_SECRET_KEY`.
3. Build variable `PUBLIC_TURNSTILE_SITE_KEY` (public site key, **never** a secret).
4. Build variable `PUBLIC_EDITORIAL_CONTACT` (an approved privacy/editorial contact).

The build only activates form submission when the site key **and** contact are provided; the backend requires KV **and** Turnstile secret and verifies each token. Accepted records expire from KV after **90 days**. Before activation, review consent language, retention obligations, privacy and contact terms. Do not store sensitive documents in the form.

Cloudflare Pages settings **after approval**: Build command `npm run build`, output directory `dist`, root `/`. Deploy the standalone repository only. Do not change unrelated Bahamas AI Solutions projects.

## Editorial trust

The publisher is Amar Pearson. Multiple featured companies are connected to him. The Atlas can cover and positively describe those companies based on factual evidence, but relationships are disclosed on relevant profiles and editorial standards. Do not publish fabricated reviews, numerical rankings without criteria, hidden paid endorsements, invented awards, client outcomes, or interviews that did not occur.

**Creative Growth Agency:** specific identity/official web presence remains unconfirmed. That profile stays in research-pending status, and no unrelated company's website is linked.  
**CocoLoop Bahamas:** an in-development concept, not an operating business.  
**TriblockHR:** metrics and security statements are attributed to the company until verified independently.  
**Pedal Paradise:** current itinerary and duration should be confirmed with the operator; the tourism authority and operator site describe different tour offerings.

## Launch gates

- [ ] Founder reviews site on a staging preview (desktop and mobile).
- [ ] Approve title, domain and trademark checks.
- [ ] Verify business facts, third-party photo rights and official URLs.
- [ ] Identify and verify Creative Growth Agency.
- [ ] Review editorial disclosures and methodology.
- [ ] Publish verified contact and privacy information.
- [ ] Test live submission endpoint and consent/abuse protection.
- [x] Add canonical URLs, generate sitemap and enable search indexing. RSS is a separate future enhancement.
- [x] Site reviewed and deployed through the existing Cloudflare Pages workflow; future releases require normal change review.

**GitHub commits ≠ verified production release.** Confirm Cloudflare deployment and live custom-domain behavior after each release.

## Cloudflare Pages blank-site recovery

The site now ships prebuilt HTML in `dist/` plus a `wrangler.toml` declaring Pages output `./dist` to prevent an empty deployment when a build command is omitted. CI tests compare `npm run build` against committed `dist` output.

Cloudflare Pages Git settings: **Framework: None; Build command: `npm run build`; Output directory: `dist`; Root directory: `/`**. The `main` branch serves the existing Cloudflare Pages site; new custom domains require separate approval.

## HorizonX-inspired review redesign

The design branch `design/horizonx-editorial-upgrade` uses the original vendor-neutral HorizonX UI Specification, adapted into [`ui-spec.yaml`](ui-spec.yaml) with concrete editorial tokens, states, breakpoints and QA gates. See [`AGENTS.md`](AGENTS.md) for future coding instructions and [`docs/HORIZONX-QA.md`](docs/HORIZONX-QA.md) for evidence-based checks.

Preview (not the production branch): https://design-horizonx-editorial-up.caribbeanbusinessatlas.pages.dev/

GitHub Actions runs `npm run build`, `npm test` and `npm run qa:browser`, testing actual mobile-sized Chromium viewports, keyboard navigation and directory interaction. Use a review branch for future changes; merge into production only after testing and authorization.

## Living Caribbean Atlas SWAGv2 branch

Preview: https://design-living-atlas-swagv2.caribbeanbusinessatlas.pages.dev/

- Cinematic documentary-photo homepage and color system drawn from Caribbean lagoons, coral sunsets, and dark-ocean tones.
- Interactive eight-market island explorer with working company/profile/photograph switching.
- Scrollable journal rail with working arrows; photo-rich sector portals linked to real directory queries.
- Command search from every page (`⌘K`/`Ctrl+K`) and keyboard-navigable results from real articles and directory records.
- Real source-company photo ribbons on Journal, Directory, About, and regional coverage pages.
- Responsive industry chips and functional grid/list directory view toggle.
- Progressive scroll reveal, reading progress, bounded magnetic buttons and responsive image depth with reduced-motion support.
- Source-company imagery is credited and remotely linked; third-party image publication permissions still need review.
- Public indexing authorized on `main`; preserve credible sources, working routes and promotional disclosures.

New implementation details in `docs/LIVING-ATLAS.md`.

The masthead now prioritizes **Explore businesses** instead of inviting visitors to use the unopened submission form. The latest Chromium QA covers intermediate tablet and compact desktop widths.

## October 2026 regional publication update

- **21** directory profiles across **eight** identified Caribbean markets, **14** journal stories, and a generated XML sitemap.
- Tranquilitas leads the hero and receives a distinct **publisher-affiliated** mobile-spa promotion and story, with direct booking actions. This is not an independently verified regional #1 ranking.
- New profiles: The New Duff, Blue Mountain Tours Jamaica, Earthworks Pottery, D' Market Movers (availability to confirm), Fond Doux Eco Resort, Grenada Chocolate Company, Caicos Dream Tours and Kreyòl Essence.
- Open crawling via `public/robots.txt`, canonical URLs in `scripts/generate.mjs`, sitemap at `/sitemap.xml`. Search ranking or appearance is not guaranteed; Search Console submission is a separate step.
- Photo source attribution and third-party publication-permission caveats in `docs/PHOTO-SOURCES.md` remain important.

## Current production domain and SEO

**Official website:** https://mag.bahamasaisolutions.com/  
**Sitemap:** https://mag.bahamasaisolutions.com/sitemap.xml  
**Search crawler instructions:** https://mag.bahamasaisolutions.com/robots.txt

All ready page canonicals, Open Graph URLs and sitemap entries use the custom domain. The legacy `caribbeanbusinessatlas.pages.dev` production hostname redirects to it via Cloudflare Pages middleware; branch preview domains remain separate. Two unfinished pages are specifically excluded from Google indexing and the sitemap (inactive `/submit/` and unverified `/directory/creative-growth-agency/`). See [docs/SEO-DOMAIN.md](docs/SEO-DOMAIN.md) for release checks, structured data and Search Console instructions.

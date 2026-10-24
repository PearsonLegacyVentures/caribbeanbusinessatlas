# Production SEO and domain policy — Caribbean Business Atlas

**Official site:** https://mag.bahamasaisolutions.com/  
**Public sitemap:** https://mag.bahamasaisolutions.com/sitemap.xml  
**Robots file:** https://mag.bahamasaisolutions.com/robots.txt  
**Former production Pages alias:** https://caribbeanbusinessatlas.pages.dev/

## Domain routing

- All 41 generated website routes use `https://mag.bahamasaisolutions.com` in their canonical links and matching Open Graph URL fields.
- All 39 sitemap URLs and the robots sitemap directive use the same canonical domain.
- `src/site-config.mjs` owns the public domain and section-specific SEO descriptions; `scripts/generate.mjs` uses this file to generate all static pages.
- Cloudflare Pages `functions/_middleware.js` issues a **301 redirect** only for the exact hostname `caribbeanbusinessatlas.pages.dev`, preserving the request's path and query parameters. It leaves custom-domain requests, API requests on the custom host, and hashed/branch preview domains unchanged.
- Cloudflare documents `functions/_middleware.js` as a supported sitewide middleware for Pages static assets and Functions. Native Cloudflare Bulk Redirects can replace the middleware in the future if desirable.

## Indexing and sitemap eligibility

- The **39 ready public URLs** are indexable and listed in the sitemap.
- The inactive submission page and unverified Creative Growth Agency profile remain accessible but explicitly use `noindex,follow`, and are omitted from the XML sitemap. This is deliberate **page-specific quality control**, not a return to sitewide `noindex,nofollow`.
- The `404.html` document also uses `noindex,follow` and does not canonicalize to the homepage.
- Pages use unique page descriptions; longer story titles have concise SEO alternatives while on-page editorial headlines are preserved.
- JSON-LD includes the site/publisher, directory and journal collections, searchable directory, company profiles, articles, and breadcrumbs. The publication does not fabricate reviews, star ratings or unverified business awards.

## Deployment verification — 24 October 2026

Before the release to `main`: **43/43** Node tests and **92/92** Chromium checks passed, including 320px width tests, real image loading and directory interactions. Cloudflare Pages branch preview completed successfully.

Following the update to `main`, direct live checks confirmed:
- Homepage, Tranquilitas profile and Tranquilitas editorial story canonicalized to `mag.bahamasaisolutions.com`.
- `robots.txt` and `sitemap.xml` on the custom domain contained no old-host references; sitemap displayed all 39 canonical URLs.
- A visit to an old `pages.dev` story address with a query parameter ended at the identical path and parameter on `mag.bahamasaisolutions.com`.

## Google Search Console follow-up

Google Search Console must have a verified property that includes the subdomain. **Submit** `https://mag.bahamasaisolutions.com/sitemap.xml` through that property, then monitor the Page Indexing and Sitemaps reports. Submitting a sitemap does not guarantee page indexing.

GSC Wizard was previously connected but its account returned **subscription_required**; the assistant could not submit or inspect the sitemap using that tool. No Google Search Console submission is claimed.

## Outstanding SEO and editorial work

- Wait for Search Console to discover/crawl the new custom host; check its chosen canonicals and any excluded URLs.
- Resolve third-party source-image permissions and check for remote image hotlink failures periodically.
- Revisit thin or unverified profiles before including them in the sitemap; preserve sponsorship and ownership disclosures.
- Consider a dedicated **PNG** social-preview image when a properly licensed, brand-specific asset becomes available. SVG favicons and ordinary Open Graph text fields are already present.
- Review real-world Core Web Vitals and iPhone Safari when sufficient usage/data exists.

Do not change the configured canonical host back to `pages.dev` or add the legacy host to new sitemap entries.

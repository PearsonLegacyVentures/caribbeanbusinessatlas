# The Living Caribbean Atlas — SWAGv2

## Product goal

Turn Caribbean Business Atlas from a static company directory into a memorable, usable discovery publication. The visitor must quickly understand the publication, see **authentic businesses**, interact with the region and reach actual published profiles and stories.

The direction is cinematic editorial futurism rather than interchangeable SaaS marketing UI. Readable on a phone; motion serves discovery. No fabricated awards, metrics or editorial endorsements.

## Design language

- **Night ocean** `#061e26` and deep teal `#062d32` create depth and confidence.
- **Lagoon** `#58decf` is the primary action color; **sun** `#ffd27c` and **coral** `#ff8065` are deliberately warm accents.
- **Sand** `#f4f0e6` anchors readable long-form content and provides visual rest between expressive sections.
- **Space Grotesk** is used for futuristic headlines and controls; **Newsreader** for selected editorial italics; **DM Sans** for reading copy.
- Real, business-specific imagery is sourced from source-company websites or publisher-controlled real site screenshots. See `src/media.mjs` and `docs/PHOTO-SOURCES.md`.
- Visual authority should come from company photography and clearly identified operations, not fake dashboards or generic AI stock photos.

## Functional interactions

| Component | Real behavior | Fallback |
| --- | --- | --- |
| Island explorer | 4 market buttons update the featured company, image, context and live directory destination; arrow/Home/End keys | Starting Bahamas company remains visible |
| Story rail | Horizontal scroll-snap controlled by working previous/next buttons with endpoint states; touch horizontal swipe | Stories are accessible as links; horizontal overflow remains scrollable |
| Directory industry pills | Synchronize with native industry select and actually filter business cards | Native search/select still work |
| Directory layout controls | Switches card presentation between grid and list and updates `aria-pressed` | Grid always usable |
| Industry portals | Navigate to `/directory/?sector=...`; directory preselects correct filter | Direct navigation to directory |
| Universal Atlas Search | Native modal with Cmd/Ctrl+K, search results sourced from real articles and businesses, proper focus return | All underlying pages remain in navigation and directory |
| Hero photo depth | Bounded pointer-based depth on real photographs | No motion on touch or reduced motion |
| Magnetic CTA | Maximum 4px response to pointer, always clickable | Static tappable CTA |
| Scroll reveal | IntersectionObserver promotes sections into view | Content visible when JS unavailable or reduced motion is preferred |
| Progress indicator | Actual reading progress on each route | Invisible when scripts disabled |
| Source-photo error | Falls back to designed card, no invented replacement photo | Original photo credits are preserved where possible |

## Source and route preservation

- Static-generator architecture and Cloudflare Git integration unchanged.
- 30 existing routes; 13 company records and nine editorial features remain.
- All independent company images have pending third-party rights review for public republication. Hotlinking is not a substitute for legal permission.
- Creative Growth Agency remains unverified, with no unrelated photograph attached.
- CocoLoop Bahamas remains in-development; its image is a website concept screenshot.
- Source citations and founder-affiliation disclosures are unchanged.
- All pages still declare `noindex,nofollow`. No custom production domain and no merge to `main` before approval.

## Automated QA evidence

On the Living Atlas branch:
- **29/29 Node tests passed.**
- **81/81 real Chromium checks passed** after fixing phone-width header and photo grid layout as well as command modal focus.
- Viewports: 320, 360, 390, 768, 840, 900, 1024, 1280 and 1440 pixels.
- Checks include zero horizontal overflow, functioning mobile menu and Escape/focus, source-image decode, Jamaica and Barbados selection, keyboard island switching, horizontal story rail, real directory filters, industry deep links, sector chips, grid/list view, universal search results and focus return, and prelaunch submission behavior.
- GitHub Actions builds, tests and compares generated static pages with committed `dist`.
- Cloudflare branch preview deploy succeeded.
- Live external browser checks confirmed that real company imagery and interactions display correctly (initial Living Atlas version).

## Still required before main merge / launch

1. Founder reviews the newest branch preview visually on an iPhone, especially photo crop/typography and creative direction.
2. Final desktop browser review on the extended secondary-page ribbons and command UI.
3. Source third-party photo republication rights or replace with approved media.
4. Manual Safari/WebKit and screen-reader testing, actual performance/CLS/LCP measurements.
5. Confirm all directory facts and the Creative Growth Agency entity.
6. Configure and test submission storage only when authorized. Live public form remains closed.

The branch is intended for review. This is a substantial redesign, not a production launch.

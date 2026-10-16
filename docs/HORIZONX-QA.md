# HorizonX 15-point UI assessment — Caribbean Business Atlas

Basis: HorizonX [Vibe Coding UI Specification v1.0](https://horizonx.so/resources/vibe-coding-ui-specification.md) and [15-point production readiness checklist](https://horizonx.so/resources/vibe-coding-ui-production-readiness).

**Assessment date:** 16 October 2026  
**Branch:** `design/horizonx-editorial-upgrade`  
**Deployment:** Cloudflare branch preview only, with `noindex,nofollow`; no production merge or custom-domain launch.  
**Automated:** 22/22 unit/structural tests and 50/50 headless Chromium browser checks.  
**Browser widths:** 320, 360, 390, 768, 1280 and 1440px. Real browser UI interaction tests include mobile menu toggling/Escape and search/filter/empty/reset behavior.  
**Human-visible browser QA:** Desktop Cloudflare preview inspected, home, directory, article, company and submission pages. No visible desktop layout defects in the checked flow.  
**Limitations:** No Safari/WebKit test, no manual iOS-device screenshot inspection, no full screen-reader session, no measured field LCP/CLS, no live submission test. A green build is **not** production approval.

## Fifteen gates — evidence register

| Gate | Evidence | Result |
| --- | --- | --- |
| 1. One dominant action | Editorial hero leads with **Read the journal**; secondary directory link is visually quieter | Supported |
| 2. Scannable hierarchy | Desktop browser visual check; typography, issue rail, feature, story cards and directory grouped | Supported on desktop; iOS visual review pending |
| 3. Specific copy | Search labels, useful empty state, clear filters, accurate submission-not-open wording | Supported |
| 4. Interaction states | Hover/focus/active, Escape close, open/closed nav, count changes, empty/reset and disabled submission; live form success/error untested | Partial |
| 5. Safe destructive actions | No user-facing destructive public action | Not applicable |
| 6. Responsive behavior | Real Chromium detects **0px horizontal overflow** at 320/360/390/768/1280/1440; also directory/profile/article/submit at 320 | Verified in Chromium |
| 7. Touch-ready controls | Mobile toggle measured at least 44px; core CSS buttons/selects at least 48px; other targets require exhaustive audit | Partial |
| 8. Stress content | Real business names, unconfirmed stage and zero search results; translated/2x names not run | Partial |
| 9. Keyboard completion | Menu opens by native button and closes with Escape, focus returns; full keyboard-only route audit pending | Partial |
| 10. Meaning without color | Stage, count, empty and disclosure states have explicit text | Supported |
| 11. Assistive-technology labels | Main nav, skip link, labeled search/select, live count and aria-expanded; external screen-reader test pending | Partial |
| 12. Predictable data handling | Prelaunch page contains **no form**; privacy and editor disclosures retained | Supported |
| 13. Honest product states | Publisher relationships, pre-commercial statuses and unverified companies labeled; no fake rankings | Supported |
| 14. System tokens | `ui-spec.yaml`, CSS semantic color/spacing/motion tokens, agent instructions | Supported |
| 15. Runtime quality | CI build reproduces committed static dist; unit tests and live browser tests pass; production performance metrics pending | Partial |

## Detected and resolved issues

- **15px overflow at 320px:** Browser QA revealed `body{min-width:320px}` exceeded the content viewport after Chrome's vertical scrollbar. Removed hard minimum, then reran all checks. Final result: **50/50**.
- **Premature test result:** Initial headless DOM dump occurred before iframe tests finished. Replaced with Chrome DevTools polling that waits for the completed QA result. The 50/50 result comes from the corrected test harness.
- **Prelaunch submission state:** The inactive form was removed from review output. Visitors cannot unknowingly type information into an unusable form.

## What was not performed

- Manual WebKit/iPhone browser verification.
- Final founder design approval.
- Visual-regression baseline image comparison.
- Full site-wide contrast audit beyond primary color pair measurements.
- Lighthouse or field Core Web Vitals measurements.
- Production deploy, indexing enablement or real Cloudflare submissions.

## Next review gate

Open the branch preview on an actual iPhone and desktop, approve the visual language and hero illustration, then authorize merging to `main` if accepted. Do not remove prelaunch indexing restrictions without a separate publishing decision.

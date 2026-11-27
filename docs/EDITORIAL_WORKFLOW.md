# Editorial operating system

## Publishing position

Caribbean Business Atlas is an editorial business directory and journal. It can have an intentional viewpoint, promotional partnerships and positive editorial selections. **It must not disguise sponsored placement, publisher ownership or unsupported "best" superlatives as independent evaluation.**

### Story lifecycle

1. **Pitch:** One headline, why readers care, market/sector, intended audience, and possible commercial conflict.
2. **Research:** At least one suitable primary source for factual assertions, with time-sensitive details dated. Seek independent corroboration for significant claims.
3. **Draft:** Strong lead, useful specifics, reader questions answered, links to official business channels. Attribute vendor claims.
4. **Verify:** Check company name, current status, URL, geography, image rights, figures, reviews and quotes. Keep source notes.
5. **Conflict review:** Disclose founder interests and clearly label sponsored placements; do not market them as editorial awards.
6. **Approve:** The owner provided standing publishing authorization on 22 November 2026. No article-by-article signoff is needed when sources, image rights, disclosures, accuracy and tests pass.
7. **Publish:** Update article slug, date, metadata, valid source links and canonical URL after the domain has been approved.
8. **Maintain:** Recheck key facts, respond to corrections and record significant changes.

### Editorial cadence

**Standing weekly target (updated 27 November 2026): EIGHT distinct, researched articles**, with exactly **SIX Tranquilitas features** and **TWO features of the founder's other eligible businesses**.

| Day | Article assignment |
| --- | --- |
| Monday | 1 Tranquilitas article |
| Tuesday | 1 Tranquilitas article (existing Tuesday/Friday task) |
| Wednesday | 1 other founder-business article |
| Thursday | 1 Tranquilitas article |
| Friday | 1 Tranquilitas article (existing Tuesday/Friday task) |
| Saturday | 1 other founder-business article |
| Sunday | 2 distinct Tranquilitas articles, independently verified and published in the same scheduled Sunday run |

This allocation requires **six Tranquilitas stories and two other-business stories**, not six articles total. The Monday/Wednesday/Thursday/Saturday/Sunday task must produce TWO separate stories on Sunday because the account's active-automation limit prevents a dedicated extra Sunday publishing task. The Tuesday/Friday task remains assigned only to Tranquilitas.

The two Wednesday/Saturday features may cover **ONLY** the following publisher-affiliated businesses: **Mel J's Event Rentals; Bahamas AI Solutions; Bahama Mineral Co.; CocoLoop Bahamas; ClearKayakPhotos.com (Clear Kayak Photos)**. Rotate these five subjects over time so the same venture does not dominate. Do not treat any other company as a primary featured business in new articles within this eight-per-week schedule; independently sourced third-party mentions are acceptable for context, comparison or news verification. Preserve historical researched profiles and existing public pages.

Tranquilitas editorial coverage should rotate all current and emerging locations across The Bahamas, Caribbean, United States and Europe over time, not repeatedly default to Nassau. See `docs/DESTINATION_COVERAGE.md` for geographic status rules. Before any destination-specific claim about active services, local therapists, partners, prices or bookings, verify against current primary evidence or authorized business records; describe unconfirmed or planned destinations as such. Avoid publishing what amounts to identical destination advertisements.

**All six named ventures are connected to the publisher.** Display a clear disclosure in each relevant story; company-provided descriptions are not third-party endorsement. CocoLoop is in development, and Bahama Mineral Co.'s operating/commercial stage must be verified before new claims. Do not invent customers, wins, reviews, partnerships, product launches, interviews or performance statistics.

There is standing publication approval from the owner, but publication still requires source verification, factual accuracy, original useful writing, image rights, functional links, build/test QA, sitemap/canonical consistency and live deployment verification. When a blocker persists, leave the piece as an unpublished draft or pull request; **do not count it toward published output**. Track the number actually live against eight, rather than confusing drafted articles with completed publication.

### Coverage mix

Within the two eligible other-venture slots, alternate product/business explainers, practical customer guides, documented milestones, founding stories and relevant sector analysis. Within six Tranquilitas slots, balance destination-specific guest help with actual operations and travel industry trends. Avoid forced cross-promotion, keyword stuffing and claims of independent awards. All articles must be genuinely useful and credible; no weekly quota excuses thin or unverified work.

### Editorial selection vs ranked lists

Use language like **"Selected by the editors"** or **"Companies to know"** for subjective features. If using **"Best"**, publish a methodology: eligibility, competitors considered, quality criteria, date of evaluation, sources, how ownership/conflicts were handled, and why the actual evidence supports the result. Do not invent independent awards or third-party recognition.

### Draft content format

```yaml
slug:
headline:
market:
sector:
status: research_pending
author: Caribbean Business Atlas
publication_status: unpublished
ownership_disclosure_required: true|false
primary_sources:
independent_sources:
fact_check:
approval:
```

Drafts are never included in `src/data.mjs` or website output until editorial approval and a deliberate code change.

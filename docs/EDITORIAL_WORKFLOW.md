# Editorial operating system

## Publishing position

Caribbean Business Atlas is an editorial business directory and journal. It can have an intentional viewpoint, promotional partnerships and positive editorial selections. **It must not disguise sponsored placement, publisher ownership or unsupported "best" superlatives as independent evaluation.**

### Story lifecycle

1. **Pitch:** One headline, why readers care, market/sector, intended audience, and possible commercial conflict.
2. **Research:** At least one suitable primary source for factual assertions, with time-sensitive details dated. Seek independent corroboration for significant claims.
3. **Draft:** Strong lead, useful specifics, reader questions answered, links to official business channels. Attribute vendor claims.
4. **Verify:** Check company name, current status, URL, geography, image rights, figures, reviews and quotes. Keep source notes.
5. **Conflict review:** Disclose founder interests and clearly label sponsored placements; do not market them as editorial awards.
6. **Approve:** Editor signs off on evidence, design and language. **No automatic publication before approval.**
7. **Publish:** Update article slug, date, metadata, valid source links and canonical URL after the domain has been approved.
8. **Maintain:** Recheck key facts, respond to corrections and record significant changes.

### Editorial cadence

**Target after launch:** a researched piece every 2–3 days, but only when evidence and editorial approval support it. Automatically prepare story briefs or drafts; never autonomously invent interviews, awards, prices, business results or citations. The manual editorial brief generator can be expanded to connected feeds and sources once credentials and workflow are approved.

### Coverage mix

For each six pieces, aim for: two sourced independent company stories; one industry insight; one founder/operator interview with direct quotes; one commercial or partnership analysis; one evidence-backed business feature. Mix country and size. No minimum percentage of affiliated businesses is a substitute for transparency.

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

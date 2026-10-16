# Website-building skills — verified shortlist (October 2026)

**Purpose:** Use a small collection of trusted, complementary agent skills for future Bahamas AI Solutions and Caribbean Business Atlas design/build work. More skills are not automatically better; retain the existing `ui-spec.yaml` and evidence-based tests.

## Recommended stack

1. **Anthropic Frontend Design** — art direction and non-generic website composition.
   - Official source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
   - Best used before a redesign to choose a clear visual concept, type treatment, page rhythm and authentic media.
   - Reference the original guidance; do not assume a repository link automatically installs the skill in ChatGPT.

2. **Vercel Web Design Guidelines** — post-build accessibility, responsiveness and visual-quality audit.
   - Official source: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
   - Directory: https://skills.sh/vercel-labs/agent-skills/web-design-guidelines
   - Typical agent installation: `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines`
   - Review installation scripts and the upstream repository before execution.

3. **UI/UX Pro Max** by NextLevelBuilder — style systems, palettes, typography options and design exploration.
   - Official source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
   - Codex installation (project environment only, user-approved): `npx ui-ux-pro-max-cli init --ai codex`
   - Use for options and research, **not** as a substitute for actual design judgment; automated styles can degrade existing sites. Avoid blindly applying all recommendations.

4. **Google Stitch Skills** — advanced screen-generation/design-to-code workflows.
   - Official source: https://github.com/google-labs-code/stitch-skills
   - Requires the Stitch MCP provider configured and relevant permissions. Worth adopting only when a project needs significant visual prototyping.

5. **Microsoft Playwright CLI Skill** — real-browser screenshots, flows and visual debugging.
   - Official skill: https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/tools/skills/playwright-cli/SKILL.md
   - Useful for repeatable desktop/mobile QA, route regressions, screenshots and keyboard testing.

## Where to find others

- https://skills.sh/ — searchable installed-skills leaderboard and links to source code; *popularity is not a quality/security guarantee*.
- https://github.com/anthropics/skills — original publisher skills.
- https://github.com/vercel-labs/agent-skills — official Vercel collection.
- https://github.com/google-labs-code/stitch-skills — Google Stitch workflows.

## For this repository

Current implemented design contract: `ui-spec.yaml`. Existing accessibility and responsive browser smoke tests: `scripts/browser-qa.mjs`, `tests/ui.test.mjs`. The code in this repo is a vanilla static generator, **not** React; Vercel React best-practices only matter if the site is migrated to React, which is not currently necessary.

**Installation security:** read a skill's `SKILL.md` and installation script before running; scope permissions narrowly; do not grant automatic production deployment; run changes in a PR; test each change.

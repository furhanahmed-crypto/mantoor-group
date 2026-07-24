# AGENTS.md

Guidance for AI agents and contributors working on this repo.

## What this project is

A static marketing site for Mantoor Group (villa real estate, Hyderabad). Prefer small, focused HTML/CSS/JS changes that match existing patterns. There is no framework, bundler, or package manager.

## Do

- Keep changes scoped to the request; avoid drive-by refactors
- Reuse existing CSS variables, button classes, and section patterns from `css/style.css` / `css/inner.css`
- Put reusable project data in `js/constants/` and render with JS when lists are repeated
- Keep brochure lead capture in `js/brochure.js`; do not add real email/API sending unless asked
- Use relative paths carefully: root pages vs `pages/` (prefix with `../` when needed)
- Preserve brand colours, fonts, and layout language documented in `DESIGN.md`

## Don’t

- Introduce React, Tailwind, Vite, or a build pipeline unless explicitly requested
- Commit secrets, `.env`, or large binary churn unrelated to the task
- Rewrite entire pages when a section-level edit is enough
- Change contact / sales emails without being asked (`sales@mantoorgroup.com` for brochure leads; `info@mantoorgroup.com` elsewhere)

## Key files

| Area | Path |
|---|---|
| Home | `index.html` |
| Ongoing projects page | `pages/ongoing.html` |
| Global styles | `css/style.css` |
| Main JS | `js/main.js` |
| Brochure modal / lead form | `js/brochure.js` |
| Ongoing projects data | `js/constants/ongoing-projects.js` |
| Brochures | `brochures/` |

## Ongoing projects rendering

Grids with `id="ongoingProjectsGrid"` are filled from `ONGOING_PROJECTS`. Set `data-root-prefix=""` on the home page and `data-root-prefix="../"` on pages under `pages/`.

Brochure mapping: Nandan Nest and Nandan Lake Breeze share `Nandan-Nest-Brochure.pdf`.

## Facebook URL

Canonical Facebook profile (use everywhere):

`https://www.facebook.com/profile.php?id=100093069050071`

# DESIGN.md

Visual language for the Mantoor Group marketing site.

## Brand

- **Company:** Mantoor Infrastructure Pvt. Ltd. / Mantoor Group
- **Positioning:** Premium villa communities — space, serenity, multigenerational living
- **Logo:** `images/mantoor-logo.png`

## Colour tokens

Defined in `css/style.css` `:root`:

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#7B2D5E` | Primary CTAs, accents |
| `--color-primary-dk` | `#5A1F44` | Hover / depth |
| `--color-gold` / `--color-gold-lt` | `#C9963A` / `#E8B96A` | Highlights, badges |
| `--color-bg` | `#FDFAF5` | Light page background |
| `--color-dark` | `#0D1628` | Dark sections, project cards |
| `--color-text` | `#1E1E2C` | Body text on light |

## Typography

- Headings: **Poppins** (`--font-heading`)
- Body: **Google Sans** / Nunito Sans fallback (`--font-body`)
- Loaded via Google Fonts in page `<head>`

## Layout patterns

- Full-width sections with `.container`
- Dark “projects” band for ongoing project cards (`.projects-section`, `.project-card`)
- Cream / pastel light sections for values, about, forms
- Sticky cream navbar (`.navbar.scrolled`)
- Floating call / WhatsApp / enquire bar on scroll

## Components

- Primary button: `.btn-primary`
- Outline / ghost CTAs: `.btn-outline`, `.btn-outline-white`, `.btn-ghost`
- Project card CTA: `.project-cta`
- Brochure CTA: `.project-brochure-btn` (paired with View Project)
- Forms: `.form-group`, `.form-error`, `.form-submit`
- Brochure lead modal: `.brochure-modal` overlay + panel

## Motion

- Scroll reveal: `.reveal` (+ left/right/scale variants)
- Card hover lift on `.project-card`
- Soft transitions via `--transition`

## Content rules for UI work

- One clear job per section; avoid cluttering project cards
- Prefer existing card / button styles over inventing new card systems
- Imagery should show real project / place context from `images/`
- Keep brochure modal focused: name, phone, email, project (read-only), remarks, submit

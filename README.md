# Mantoor Group Website

Marketing website for **Mantoor Infrastructure Pvt. Ltd.** — premium villa communities across Hyderabad.

## Stack

- Static HTML / CSS / vanilla JavaScript
- No build step required
- Served locally with any static server (e.g. `php -S localhost:8080`)

## Project structure

```
├── index.html              # Home
├── pages/                  # Inner pages (projects, about, contact, etc.)
├── css/                    # style.css (global) + inner.css (inner pages)
├── js/
│   ├── main.js             # Site behaviours
│   ├── brochure.js         # Brochure modal + lead capture
│   └── constants/
│       └── ongoing-projects.js
├── images/                 # Site imagery
└── brochures/              # Project brochure PDFs / PPTX
```

## Local development

```bash
php -S localhost:8080
```

Open [http://localhost:8080](http://localhost:8080).

## Ongoing projects & brochures

Ongoing project cards are rendered from `js/constants/ongoing-projects.js`.

**Download Brochure** opens a lead form (name, phone, email, remarks). Project name is set from the clicked card. On submit:

1. Lead is POSTed to `send.php` (PHPMailer) and emailed to `sales@mantoorgroup.com` and `f4rh4n6710@gmail.com`
2. The matching brochure downloads from `/brochures`

| Project | Brochure file |
|---|---|
| Nandan Emerald | `Nandan-Emerald-Brochure.pdf` |
| Nandan Nest | `Nandan-Nest-Brochure.pdf` |
| Nandan Lake Breeze | `Nandan-Nest-Brochure.pdf` (shared) |
| Mantoor Mukunda | `Mantoor-Mukunda-Brochure.pptx` |
| Praakrithi County | `Praakrithi-County-Brochure.pdf` |

## Social

- Facebook: [Mantoor Infrastructure Pvt Ltd](https://www.facebook.com/profile.php?id=100093069050071)
- Instagram: https://instagram.com/mantoor.group/
- X: https://x.com/MantoorGroupHyd
- LinkedIn: https://linkedin.com/company/mantoorgroup/

## Docs

- [AGENTS.md](./AGENTS.md) — conventions for AI / contributors
- [DESIGN.md](./DESIGN.md) — visual language and UI patterns

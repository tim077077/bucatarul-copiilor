# Bucătarul copiilor: website

An Astro static site built around one idea, "Meniul săptămânii": the weekly menu every Romanian kindergarten pins on its door, turned into the interactive centrepiece of the home page.

## Run

```bash
npm install
cp .env.example .env      # PUBLIC_DRAFT=true shows shot IDs in photo placeholders
npm run dev               # http://localhost:4321
npm run build && npm run preview
```

## Structure

| Path | What it is |
|---|---|
| `src/styles/tokens.css` | Colours (milk, parsley, tomato, yolk, mint), type scale, radii, motion tokens |
| `src/data/site.ts` | Contacts and navigation, defined once |
| `src/data/menu.ts` | The 4-week menu cycle (sample dishes) and `cycleStart`. **Replace with Marius's real A4 sheet** |
| `src/data/faq.ts` | FAQ. `confirmed: false` answers appear only in draft mode |
| `src/components/MenuBoard.astro` | The signature interactive weekly menu (4-week cycle: week buttons + day tabs, "acum"/"azi" tags once `cycleStart` is set) |
| `src/components/Photo.astro` | Photo slot: a placeholder until the real image is passed as `src` |
| `src/components/OfferForm.astro` | Offer form, posts to `public/trimite-oferta.php` (PHP mail on the cPanel host), with variants `full` / `short` / `event` |
| `src/assets/logo/*.svg` | Official logo traced to vector: horizontal, mark and stacked versions |
| `tools/` | Logo trace, favicon/OG generator, screenshot, overflow, axe and functional scripts |

## Before launch

1. **Form:** handled by `public/trimite-oferta.php` on the cPanel host: emails marius@bucatarulcopiilor.ro and keeps a copy in `~/oferte-site.log` (outside public_html). Send a test request after every upload. In cPanel, *Email Deliverability* should show SPF/DKIM as valid.
2. **Photos:** pass `src="/photos/xx.jpg"` to each `<Photo shot="…">`. Shot IDs are in the plan's shot list (menu plates M1-1 … M4-5, i.e. week-day; P1–P4, A1–A3, C1, E1–E8, K1–K3).
3. **Draft mode:** set `PUBLIC_DRAFT=false` for production. This hides shot labels, unconfirmed FAQ answers and editor notes.
4. **Logo:** replace the trace with the vector original if the client has one.
5. **Legal:** have the privacy text reviewed. Add an analytics/consent banner if GA4 is kept.
6. **Menu cycle:** set `cycleStart` in `src/data/menu.ts` to the Monday a "Săptămâna 1" began.
7. **Domain:** deploy to Cloudflare (Workers static assets or Pages). `/landing` already redirects to `/`.

## Copy that still needs the client's confirmation
- The 4-week menu (dish names) and the cycle start date.
- Different portions per age group (creșă / grădiniță / afterschool).
- The chef quote on the home page and the story on `/despre`.
- Thermal containers for delivery.
- "Ajustăm împreună" (adjusting the menu based on feedback).
- Allergens being marked on every menu.
- FAQ answers flagged "de confirmat": delivery area, minimum number of children, menu changes, DSVSA authorisation.
- Response time in the form's success message ("in at most one working day").
- Partner names and quotes. The testimonials section stays out until real, approved quotes exist.

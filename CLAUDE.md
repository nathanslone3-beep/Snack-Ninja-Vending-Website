# CLAUDE.md — Snack Ninja Vending Web Design Rules

## ALWAYS DO FIRST — Every Session, No Exceptions

1. **Read the skill file** before writing any frontend code:
   `C:\Users\sslon\.claude\skills\frontend-design.md`
   Apply every rule in it without exception. Do not start coding until you have read it.

2. **Check brand assets** in `images/` before designing — use real images, never placeholders.

3. **Start the dev server** before any screenshots: `node serve.mjs` (port 3000).
   Never start a second instance if one is already running.

---

## Project Context

- **Business:** Snack Ninja Vending LLC — AI-powered smart cooler vending, Louisville KY
- **Site:** 5-page HTML site (index, our-ai-smart-coolers, our-process, services, contact)
- **Shared styles:** `shared.css` — all design tokens defined here
- **Shared JS:** `shared.js` — nav, scroll-reveal, FAQ accordion, stat counters

---

## Design Tokens (enforce exactly — do not invent new values)

```css
--black:   #08080F   /* primary background */
--base:    #0E0E1C   /* alternate section background */
--dark:    #13132A   /* card/surface background */
--elev:    #1C1C38   /* elevated surface */
--float:   #2A2A48   /* floating/border elements */
--cyan:    #00E5FF   /* primary accent */
--green:   #39FF14   /* secondary accent */
--purple:  #7B5CF0   /* tertiary accent */
--muted:   #8892A4   /* secondary text */
--white:   #F0F0F0   /* primary text */
```

- Headings: **Space Grotesk** (weight 700–800, letter-spacing -0.03em)
- Body: **Inter** (weight 400–500, line-height 1.7)
- Gradients: `linear-gradient(135deg, #00E5FF, #7B5CF0)` (cyan→purple) or `linear-gradient(135deg, #39FF14, #00E5FF)` (green→cyan)

---

## Screenshot Workflow

```bash
# Take a screenshot (server must be running first)
node screenshot.mjs http://localhost:3000 label-name

# Screenshot a specific page
node screenshot.mjs http://localhost:3000/our-process.html process

# After screenshotting:
# Read the PNG with the Read tool → analyze visually → fix issues → re-screenshot
# Minimum 2 rounds per page. Stop only when no visible issues remain.
```

**What to check in every screenshot:**
- Fonts loaded (Space Grotesk headings, Inter body)
- Colors match tokens above exactly
- No invisible sections (the screenshot script adds `.visible` to all `.reveal` elements)
- Images visible and correctly cropped (no white backgrounds on dark surfaces)
- Spacing is consistent — use the 8px grid (8, 16, 24, 32, 48, 64, 96px)
- Navbar and footer render correctly on all pages
- Mobile view — test at 375px width for any responsive breakpoint issues

---

## Scroll Reveal — Important Rule

The `.reveal` class sets `opacity: 0` for animation purposes. The screenshot script adds `.visible` to all `.reveal` elements before capturing, so screenshots show full content. In the browser, IntersectionObserver handles the animation correctly.

**Never** apply `.reveal` to the entire `<section>` — only to specific child elements (cards, headings, grids) so above-fold content is visible immediately.

---

## Hard Rules

- No `transition-all` anywhere — only animate `transform` and `opacity`
- No default Tailwind blue/indigo as primary color
- No same font for headings and body
- No placeholder images (`placehold.co`) — use real images from `images/`
- At least 2 screenshot rounds before declaring a page complete
- hover, focus-visible, AND active states on every interactive element
- Always use `cubic-bezier(0.22, 1, 0.36, 1)` for spring-style easing

---

## File Structure

```
/
├── CLAUDE.md              ← this file
├── index.html             ← Home page
├── our-ai-smart-coolers.html
├── our-process.html
├── services.html
├── contact.html
├── shared.css             ← all shared styles + design tokens
├── shared.js              ← nav, scroll-reveal, FAQ, counters
├── serve.mjs              ← dev server (port 3000)
├── screenshot.mjs         ← Puppeteer screenshot tool
├── images/                ← all real site images
│   ├── logo-text.png
│   ├── cooler-front.jpg
│   ├── cooler-side.jpg
│   ├── cooler-product.png
│   ├── cooler-phone.png
│   ├── brochure.png
│   ├── safari-screen.png
│   ├── home-desktop.png
│   ├── home-phone.png
│   ├── tron-bg.png
│   └── logo-169.png
└── temporary screenshots/ ← auto-saved Puppeteer screenshots
```

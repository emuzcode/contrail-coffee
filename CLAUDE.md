# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contrail Coffee & Chocolate is a static website for a coffee and chocolate shop in Chichibu, Saitama. The site is a modern, responsive, mobile-first single-page application hosted on GitHub Pages at www.contrail.life. It features minimal JavaScript, custom CSS utilities, and integration with Google Sheets for dynamic business calendar functionality.

## Architecture

### Single-Page Static Site
- **No build process**: Pure HTML/CSS/JavaScript - changes are immediately live
- **No framework**: Vanilla JavaScript with custom utilities
- **Custom CSS**: Hand-written utility classes mimicking Tailwind CSS patterns in `styles.css`
- **Mobile-first responsive design**: Extensive use of responsive breakpoints (sm/md/lg)

### Key Technical Components

#### 1. Loading Animation System (`#loading` + "Image preload + loading animation" script)
- Three-part logo animation using opacity, transform, and clip-path transitions
- Session-based skip logic (`sessionStorage.getItem('contrail-visited')`)
- Staged reveal: main logo → line → dot → overlay fades → header and today's status arrive (`body.hero-in`)
- **Hand-off contract**: the hero logo (`.hero-logo`) must sit exactly under the loading logo, so it stays put when the overlay fades. Both are `85vw` wide (`min(640px, 90vw)` from 640px up) and centred on `50vh`. If you change the loading logo's size or position, change `.hero` / `.hero-logo` to match (and the `0.20875` factor if the image aspect changes).
- The animation uses the lightweight `contrail-{line,main,dot}-1600.png` layers; the hero uses `contrail-logo-1600.png` (same 1600×668 canvas). The 4868px originals remain for OG / icons.

#### 2. Dynamic Business Calendar (`#calendar` + `initializeCalendar()`)
- Fetches business days from Google Sheets API (SPREADSHEET_ID: `1BRHncUHIE9c4YZrq6Sa6oyaFULAd5uPE5GDNMIIc7Kg`)
- `contrailIsOpen(date)` is the single opening rule (sheet row, else closed on Thursdays); the calendar, the saved image and the today status all use it
- `#cal-year` / `#cal-month` must keep the year and the **English** month name: `downloadCalendar()` reads them for the file name. The Japanese month is shown separately in `#cal-month-ja`
- Only the bear (`#downloadKuma`) is the long-press target: it calls `preventDefault()` on touchstart, so a larger target would block scrolling
- Sheet format: columns for date, status (open/closed), and notes
- Handles multiple date formats (Google Sheets Date() format, Excel serial dates, ISO strings)
- Client-side calendar rendering with prev/next month navigation
- Canvas-based calendar image generator for download (1080x1080px PNG)
- "Kuma" download button with 3-second press-and-hold animation (360° rotation)

#### 2b. Today's status, menu tabs, concept
- **Today** (`#today-card`, in the hero): date, 営業日 / 定休日 / 休業日, today's hours (`CONTRAIL_HOURS`) and the latest news title. Rendered by `renderTodayCard()` / `renderTodayNews()`; both are wrapped so a failure can never block the calendar start-up
- **Menu**: `renderMenu()` builds category tabs (one panel visible at a time) from the sheet's categories; rows keep the `.menu-row .name .price` structure
- **Concept** (`#concept`, after Access): vertical text whose columns arrive one by one, then a trail wiped in with `clip-path`. The reveal observer watches the `.cc-concept-trail` wrapper, because a fully clipped element never reports as intersecting

#### 3. Mobile Optimization Strategies
- `transform: translate3d(0, 0, 0)` for GPU acceleration
- `-webkit-backface-visibility: hidden` to prevent flicker
- `will-change` properties on animated elements
- `touch-action: manipulation` to prevent double-tap zoom
- Scroll performance optimizations with `-webkit-overflow-scrolling: touch`

#### 4. Background Image Handling
- `.concept-bg` uses absolute positioning with parallax prevention
- Multiple media query breakpoints to prevent mobile scrolling jank
- Extensive CSS to lock background position on mobile devices

## Common Development Commands

### Local Development
```bash
# Serve locally (any method works)
python -m http.server
# Or use any local server - open index.html directly also works
```

### Git Workflow
```bash
# Standard workflow - GitHub Pages auto-deploys from main branch
git add .
git commit -m "description"
git push origin main
```

## File Structure

```
/
├── index.html          # Single-page application - all content here
├── styles.css          # Custom utility CSS (Tailwind-like)
├── manifest.json       # PWA manifest
├── CNAME              # Custom domain: www.contrail.life
├── assets/
│   ├── images/        # Logo components, photos, icons
│   │   ├── contrail-logo-transparent.png  # Main logo, full size (OG image, icons)
│   │   ├── contrail-logo-1600.png        # Hero logo (lightweight)
│   │   ├── contrail-main-1600.png        # Loading animation: main text
│   │   ├── contrail-line-1600.png        # Loading animation: line above
│   │   ├── contrail-dot-1600.png         # Loading animation: dot on 'i'
│   │   ├── contrail-{main,line,dot}.png  # 4868px originals of the three layers
│   │   ├── concept-image.png             # Parallax background
│   │   └── kuma.png                      # Calendar download button
│   └── icons/
│       └── Instagram_Glyph_Gradient.png
└── README.md
```

## Important Patterns & Conventions

### CSS Utility Classes
- Follow existing naming patterns in `styles.css`
- Responsive classes: `sm:*` (640px+), `md:*` (768px+), `lg:*` (1024px+)
- Spacing scale: 0.25rem increments (p-1, p-2, p-3, p-4, p-6, p-8, p-12)
- Font families: `.font-zen` (Zen Old Mincho serif), `.font-sans` (Noto Sans JP)

### JavaScript Patterns
- All scripts are inline in `<script>` tags at bottom of `index.html`
- Async/await for Google Sheets API calls
- Functional style with named functions in appropriate scopes
- Event delegation and passive event listeners for performance

### Mobile Performance
- Always use `translate3d(0, 0, 0)` instead of `translate()` for transforms
- Add `touch-manipulation` class to interactive elements
- Test on actual mobile devices - iOS Safari has strict performance requirements

### Business Calendar Integration
- Date format in Google Sheets: flexible (handles Date(), serial numbers, ISO strings)
- Status values: "open" or "closed" (case-insensitive)
- `normalizeDate()` function handles all format conversions to YYYY-MM-DD
- Calendar images use Canvas API - all styling must be replicated in canvas drawing code

## Critical Constraints

1. **No build tools**: Do not introduce webpack, vite, npm scripts, etc.
2. **Maintain GitHub Pages compatibility**: All paths must be relative, no server-side logic
3. **No JavaScript frameworks**: No React, Vue, jQuery, etc.
4. **Keep it lightweight**: Minimal external dependencies, prioritize performance
5. **Preserve Japanese language support**: Main content is in Japanese (lang="ja")
6. **Don't break the Google Sheets integration**: Calendar depends on specific spreadsheet ID and format

## Content Sections (in order)

1. Hero: logo (same position as the loading logo) + today's opening status
2. Menu section with category tabs (お飲み物 / お菓子 / お酒 / コラボ商品)
3. News section (chronological updates, latest three shown first)
4. Business calendar with Google Sheets integration (regular hours, month grid, long-press save)
5. Access/Location section with Google Maps embed
6. Concept (vertical text + trail) — deliberately near the end; do not name the owner's former career in public copy
7. Footer with Instagram link

The site is designed smartphone-first.

## Testing Checklist

When making changes, verify:
- [ ] Logo loading animation works on first visit
- [ ] The logo does not move or blink when the loading overlay fades; today's status appears shortly after
- [ ] Logo animation skips on subsequent visits (same session)
- [ ] Menu tabs switch categories; news "続きを読む" and "すべてのお知らせを見る" work
- [ ] Calendar loads business days from Google Sheets
- [ ] Calendar month navigation works
- [ ] Kuma download button creates and downloads PNG
- [ ] Responsive breakpoints work (mobile, tablet, desktop)
- [ ] Japanese fonts load correctly (Zen Old Mincho, Noto Sans JP)
- [ ] Site works in iOS Safari (most restrictive browser)

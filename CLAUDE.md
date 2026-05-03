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

#### 1. Loading Animation System (index.html:66-608)
- Three-part logo animation using opacity, transform, and clip-path transitions
- Session-based skip logic (`sessionStorage.getItem('contrail-visited')`)
- Staged reveal: main logo → line → dot → content fade-in

#### 2. Dynamic Business Calendar (index.html:610-1134)
- Fetches business days from Google Sheets API (SPREADSHEET_ID: `1BRHncUHIE9c4YZrq6Sa6oyaFULAd5uPE5GDNMIIc7Kg`)
- Sheet format: columns for date, status (open/closed), and notes
- Handles multiple date formats (Google Sheets Date() format, Excel serial dates, ISO strings)
- Client-side calendar rendering with prev/next month navigation
- Canvas-based calendar image generator for download (1080x1080px PNG)
- "Kuma" download button with 3-second press-and-hold animation (360° rotation)

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
│   │   ├── contrail-logo-transparent.png  # Main logo
│   │   ├── contrail-main.png             # Loading animation: main text
│   │   ├── contrail-line.png             # Loading animation: line above
│   │   ├── contrail-dot.png              # Loading animation: dot on 'i'
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

1. Hero section with animated logo
2. Concept section with parallax background image and tagline
3. Menu section (Coffee, Chocolate drinks, Organic soda, Craft chocolate, Donuts)
4. News section (chronological updates)
5. Business calendar with Google Sheets integration
6. Access/Location section with Google Maps embed
7. Footer with Instagram link

## Testing Checklist

When making changes, verify:
- [ ] Logo loading animation works on first visit
- [ ] Logo animation skips on subsequent visits (same session)
- [ ] Mobile scrolling is smooth (no jank on concept background)
- [ ] Calendar loads business days from Google Sheets
- [ ] Calendar month navigation works
- [ ] Kuma download button creates and downloads PNG
- [ ] Responsive breakpoints work (mobile, tablet, desktop)
- [ ] Japanese fonts load correctly (Zen Old Mincho, Noto Sans JP)
- [ ] Site works in iOS Safari (most restrictive browser)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

Start a local dev server:
```bash
python3 -m http.server 3000 --bind 0.0.0.0
```

There is no build step, no package.json, and no dependencies — this is a zero-tooling static site. Files are served as-is.

Deployment happens automatically via GitHub Actions on push to `main` (`.github/workflows/deploy.yml`), deploying the repo root to GitHub Pages at `janagramlich.com`.

## Architecture

Static HTML/CSS/JS portfolio for Jana Gramlich (product designer, Berlin). Each page is a self-contained `.html` file with its own inline `<style>` block and inline `<script>` — there are no shared CSS or JS files.

**Content backend:** WordPress headless CMS at `https://cms.janagramlich.com/wp-json/wp/v2`. Dynamic pages (`articles.html`, `article.html`, `project.html`, `archive.html`) fetch content via the WP REST API using async/await with `AbortSignal` timeouts. Custom post types use ACF fields (`?acf_format=standard`). Media URLs are resolved separately via `/media/{id}?_fields=source_url`.

**Key JS patterns used across pages:**
- Scroll-driven nav animation: morphs from full-width bar to pill shape using lerp interpolation
- View Transitions API for card-to-page morphing when opening projects/articles (`view-transition-name`)
- Graceful API fallbacks: missing images and broken fetches are silently suppressed, never shown as errors to users

**Styling conventions:**
- All styles are inline per page — no external stylesheet
- CSS custom properties for theming
- Responsive via media queries; fluid typography via `clamp()`
- Glassmorphism effects use `backdrop-filter` with `-webkit-` prefixes for iOS

**Fonts:** Suisse Intl (self-hosted OTF in `/fonts/`) + DM Sans (Google Fonts).

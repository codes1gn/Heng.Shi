# Heng Shi — Academic Homepage

Personal academic website for Heng Shi, focused on compilers, runtimes, programming models, sparse inference, and AI systems.

**Live:** Deployed via GitHub Pages on push to `main`.

## Project Structure

```
.
├── index.html          # Main homepage (bilingual EN/ZH)
├── styles.css          # All styles
├── script.js           # Theme toggle, language switch, interactions
├── favicon.svg         # Site favicon
├── assets/
│   ├── profile/        # Portrait and profile images
│   ├── projects/       # Project illustrations
│   └── logos/          # Brand assets
├── .github/workflows/  # GitHub Pages auto-deploy
├── concept-*.html      # Design concept drafts
├── round*.html         # Earlier design iterations
└── academic-*.html     # Academic layout variants
```

## Run Locally

This is a **static site** — no build step, no `npm install`, no bundler. Any HTTP server that can serve files from the project root will work.

### Option 1: Python (recommended — pre-installed on most systems)

```bash
cd /home/albert/workspace/heng.shi-personal-website
python3 -m http.server 8080 --bind 0.0.0.0
```

Open http://localhost:8080 in your browser.

### Option 2: Node.js (if available)

```bash
npx serve -l 8080
```

### Option 3: Open directly

```bash
# Just open the file in a browser (some features like fonts may not load)
xdg-open index.html      # Linux
open index.html           # macOS
```

## Persistent Hosting with `screen`

To keep the server running after you disconnect from SSH:

```bash
# Start a detached screen session
screen -dmS personal-website bash -c "cd /home/albert/workspace/heng.shi-personal-website && python3 -m http.server 8080 --bind 0.0.0.0"

# Verify it's running
screen -ls | grep personal-website

# Reattach to see logs
screen -r personal-website

# Detach again: press Ctrl+A, then D

# Stop the server
screen -S personal-website -X quit
```

## Deployment

Pushes to `main` auto-deploy via the GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. The workflow copies all static files (excluding `.git` and `.github`) into a `dist/` folder and publishes to GitHub Pages.

## Tech Stack

- Pure HTML5, CSS3, JavaScript (no framework)
- Google Fonts: Raleway + Noto Sans SC
- Bilingual support (English / 中文) via `data-*` attributes
- Light / dark theme toggle

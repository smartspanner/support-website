# AI Agent Instructions

## Git Workflow

**MANDATORY: Check for uncommitted changes at the START of each new task:**
```bash
git status --short
```

If uncommitted changes exist from a previous task:
1. **Same topic**: Continue working, commit when fully complete
2. **New topic**: Ask user whether to commit, stash, or discard previous changes

**Commit only when complete:**
- Fix is **verified working** (tested)
- Feature is **complete** (not partial)
- Tests pass (if applicable)

**Commit command:**
```bash
git add -A && git commit -m "prefix: description" && git push
```

**Commit prefixes:**
- `fix:` - Bug fixes
- `feat:` - New features
- `refactor:` - Code improvements
- `style:` - UI/CSS changes
- `docs:` - Documentation
- `test:` - Test changes

**Commit message format:**
- Use imperative mood ("add feature" not "added feature")
- Keep first line under 72 characters
- Include summary of what changed and why

---

# SmartSpanner Support Docs - Jekyll

## Overview
Support documentation site for SmartSpanner CMMS users. Built with Jekyll, deployed to GitHub Pages.

## Access
- **Production**: https://support.smartspanner.com
- **Local Dev**: https://tenx.fraction.app/support.smartspanner.com/
- **Build Output**: `/home/dev/tenx/apps/websites/support.smartspanner.com/_site/`

## Important: Two Configuration Files

### `_config.yml` (Production) - DO NOT modify for local dev
- `url: "https://support.smartspanner.com"`
- `baseurl: ""`

### `_config_dev.yml` (Development) - Use for local dev
- `url: "https://tenx.fraction.app"`
- `baseurl: "/support.smartspanner.com"`

## Building the Site

**IMPORTANT: After making ANY changes, you MUST rebuild:**

```bash
# Build with dev config for local testing
docker exec websites_jekyll bash -c "cd /srv/support.smartspanner.com && jekyll build --config _config.yml,_config_dev.yml"

# Verify build
curl -I https://tenx.fraction.app/support.smartspanner.com/
```

## Structure
```
_pages/                    # Documentation pages (Markdown)
_data/navigation.yml       # Sidebar navigation structure
_includes/sidebar.html     # Sidebar partial
assets/images/             # Screenshots
```

## Content Guidelines
- Write in Markdown with GFM
- Focus on maintenance management workflows
- Target audience: Maintenance teams and facilities managers
- Use `{{ site.baseurl }}/assets/images/...` for image paths

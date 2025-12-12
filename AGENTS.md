# SmartSpanner Support Docs - Jekyll

## Overview
Support documentation site for SmartSpanner CMMS users.

## Access
- **Production**: https://support.smartspanner.com
- **Local Dev**: http://localhost:8080/smartspanner-support

## Build Commands
```bash
# Build for local development
docker compose exec jekyll jekyll build --config _config.yml,_config_dev.yml

# Watch mode
docker compose exec jekyll jekyll build --config _config.yml,_config_dev.yml --watch
```

## Structure
```
_pages/                    # Documentation pages (Markdown)
_data/navigation.yml       # Sidebar navigation structure
_includes/sidebar.html     # Sidebar partial
```

## Content Guidelines
- Write in Markdown with GFM
- Focus on maintenance management workflows
- Target audience: Maintenance teams and facilities managers

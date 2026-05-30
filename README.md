# TabSilo

Chrome extension that saves all open tabs into a global pool, auto-groups by subdomain, and deduplicates by URL.

## Features

- 🔘 Click icon → save & close all tabs in current window
- 📂 Auto-group by subdomain
- 🔄 Automatic URL deduplication
- 🔗 Click to restore (tab stays in list)
- 🔍 Search saved tabs
- 🗑️ Delete individual tabs or entire domain groups

## Development

```bash
npm install
npm run dev     # Start dev server with HMR
npm run build   # Production build
npm run test    # Run tests
```

## Install (Local)

1. `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select `dist/` folder

## Tech Stack

- TypeScript
- Vue 3 (Composition API)
- Vite + CRXJS
- Chrome Manifest V3
- chrome.storage.local

# TabSilo

[![CI](https://github.com/kaydxh/tabsion/actions/workflows/ci.yml/badge.svg)](https://github.com/kaydxh/tabsion/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Chrome extension that saves all open tabs into a global pool, auto-groups by subdomain, and deduplicates by URL.

## Features

- 🔘 **One-click save** — Click icon to save & close all tabs in current window
- 📂 **Auto-group** — Tabs grouped by subdomain automatically
- 🔄 **Deduplication** — Same URL never saved twice
- 🔗 **Quick restore** — Click to reopen (tab stays in list)
- 🔍 **Search** — Filter saved tabs by title or URL
- 🗑️ **Manage** — Delete individual tabs or entire domain groups

## Screenshot

<!-- TODO: Add screenshot -->

## Install

### From Source

```bash
git clone https://github.com/kaydxh/tabsion.git
cd tabsion
npm install
npm run build
```

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `dist/` folder

## Development

```bash
npm install
npm run dev       # Dev server with HMR
npm run build     # Production build
npm run test      # Run tests (watch mode)
npm run test:run  # Run tests once
```

## Tech Stack

- TypeScript
- Vue 3 (Composition API)
- Vite + CRXJS
- Chrome Manifest V3
- chrome.storage.local

## Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

[MIT](./LICENSE)

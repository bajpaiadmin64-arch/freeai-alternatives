# FreeAI Alternatives

**Powerful AI doesn't always have to be expensive.**

A free, modern directory website that helps users discover legitimate free AI tools, free tiers and open-source
alternatives to expensive AI assistants. Every link points to the **official website** of the listed provider —
no cracked services, no shared accounts, no unauthorized access.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Lucide icons
- `qrcode` (client-side UPI QR generation)

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Verification scripts

```bash
node scripts/check-data.mjs   # data integrity (ids, categories, statuses, cross-references)
node scripts/check-urls.mjs   # HEAD-check every official URL in the data file
node scripts/smoke-test.mjs   # full browser test (needs Chrome + `npm run preview` running on :4173)
node scripts/layout-test.mjs  # mobile/desktop layout checks
node scripts/screenshots.mjs  # capture desktop/mobile screenshots
```

## How to update the tool data

All AI tools live in **one file**: `src/data/tools.js`.

To add, edit or remove a tool, edit that file only — the UI reads everything from it. Each tool has this shape:

```js
{
  id: 'deepseek',                 // unique slug
  name: 'DeepSeek',
  company: 'DeepSeek AI',
  category: 'chat',               // chat | coding | research | writing | image | video | productivity
  description: '...',
  officialUrl: 'https://chat.deepseek.com',   // MUST be the official domain
  freeStatus: 'Completely Free',  // Completely Free | Free Tier | Free with Limits | Limited Free | Free Account Required | Open Source
  accountRequired: false,
  bestFor: 'Reasoning & Coding',
  features: ['...'],
  limitations: '...',             // be honest about free-tier limits
  webSearch: true,                // comparison flags (used in Compare section)
  coding: true,
  reasoning: true,
  imageGen: false,
  fileUpload: true,
  longContext: true,
  apiAvailable: true,
  openSource: true,
  color: '#4d6bfe',               // logo chip color
}
```

Other editable config in the same file:

- `categories` — category chips
- `freeStatusFilters` / `accountFilters` — filter groups
- `alternativeFinder.paidOptions` — the "Find Your Free Alternative" mappings
- `featured` — the "Best Free AI Tools Right Now" picks
- `studentToolIds` — the students section lineup
- `comparisonRows` — comparison table rows
- `siteConfig` — site name, tagline, footer line, last-verified date

### Before publishing an update

1. Verify every `officialUrl` actually loads (HTTPS only).
2. Verify the free-tier details on the provider's official site.
3. Update `lastChecked` (per tool) and `siteConfig.dataUpdatedOn`.
4. Never claim something is unlimited unless the provider says so.
5. Never link to unofficial mirrors, clones or pirated services.

## Important content rules

- The site lists **legitimate free access** only — free plans, free tiers, open-source/open-weight models.
- Free-status labels are honest: "Free Tier", "Completely Free", "Free with Limits", etc.
- Recommendations are qualified ("Recommended for coding"), not absolute "best" claims.
- The site is not affiliated with any listed company.

## Deploy

It's a static site — build and upload `dist/` to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

# Security System Bundle Builder

A multi-step bundle builder with a live review panel. Built with React, TypeScript, and Tailwind CSS v4.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build       # type-check + production build
npm run preview     # preview the production build locally
```

## Lint & format

```bash
npm run lint
npm run format          # auto-fix
npm run format:check    # check only
```

## Project structure

```
src/
├── components/
│   ├── builder/      # Accordion steps, product cards, quantity stepper, variant selector
│   ├── review/       # Review panel, category groups, order summary, line items
│   └── ui/           # Modal, shared button primitives
├── data/
│   ├── products.json # Product catalog (single source of truth)
│   ├── products.ts   # Zod-validated loader
│   └── initialBundle.ts
├── hooks/
│   └── useBundle.ts  # Central bundle state (quantities, variants, accordion, save/reset)
├── lib/
│   ├── schemas.ts    # Zod schemas for product/bundle validation
│   └── storage.ts    # localStorage persistence layer
├── types/
│   └── bundle.ts     # Shared TypeScript types
├── utils/
│   ├── bundle.ts     # Product/variant lookup, validation
│   ├── pricing.ts    # Price formatting, subtotal/savings calculations
│   └── selections.ts # Selection grouping, filtering, counting
├── App.tsx
├── index.css         # Design tokens (colors, shadows, radii)
└── main.tsx
```

## Key decisions & tradeoffs

- **Tailwind CSS v4 with `@tailwindcss/vite`** — CSS-first config via `@theme` in `index.css`. No `tailwind.config.js`.
- **`useBundle()` is single-instance** — called once in `BundleBuilder`. All child components (ProductGrid, ReviewPanel) receive data and callbacks via props. This prevents out-of-sync state.
- **Variant quantities are independent** — each variant of a product tracks its own count. Switching variants in the card never resets quantities for other variants. The review panel shows every variant with `quantity > 0` as its own line.
- **Data-driven from `products.json`** — no hardcoded per-product markup. Adding a product to the JSON automatically creates its card, variants, and review-panel representation.
- **localStorage persistence** — `saveBundle()` persists selections, active step, and active variants. On next visit, `useBundle()` checks localStorage first before falling back to the initial empty state.
- **No backend required** — the product catalog is a local JSON file. Serving it from an API would be a trivial change (swap the import in `products.ts`).
- **Empty initial state** — the app loads with no optional products selected. The Figma's populated review panel was a visual reference only.
- **Plan products use a `Shield` icon** instead of a product image, and have no quantity stepper in the builder (plan is a toggle, not a count).

## What's not implemented

- A real checkout flow (the Checkout button resets the bundle)
- Product detail image gallery in the modal
- Server-side persistence (localStorage only)
- Accessibility motion/animation preferences

## Requirements

- Node.js 20+
- npm 9+

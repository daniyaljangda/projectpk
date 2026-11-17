# Wisdom Traders — website

A static site for a packaging supplier in Karachi. It has a catalogue with price breaks, an order list that is sent on WhatsApp, and a quote form for custom printing. It has no build step and no backend. Open `index.html`, or host the folder anywhere (GitHub Pages, Netlify, cPanel).

## What to edit

Everything a non-developer will change is in **`assets/js/data.js`**:

| What | Where in `data.js` |
|---|---|
| Phone, WhatsApp, email, address, hours, delivery and payment terms | `WT.business` |
| Categories (name, short name, one-line description) | `WT.categories` |
| Products, sizes, material, minimum order, price breaks | `WT.products` |
| **Customer list** on the home and About pages | `WT.customers` |

The customer names, contact details and prices in the file now are **placeholders**. Replace them before launch, and only list customers who have agreed to it.

Price breaks are `[minimum quantity, price each]`. The first row is the minimum order, e.g. `[[50, 64], [100, 56], [500, 49], [1000, 44]]`.

## Pages

- `index.html`: home
- `catalogue.html`: all products; filter with `?cat=food`, search with `?q=jar`
- `product.html?id=pizza-12`: product page with a scale drawing, price-break table and quantity picker
- `order.html`: order list (kept in the browser) that is sent as a WhatsApp message
- `contact.html`: contact details and the printing quote form (`#quote`)
- `about.html`

## Product images

Each product is drawn as an SVG from its dimensions (`assets/js/draw.js`). This was chosen over stock photos. Real photos of your own stock, even taken on a phone, would add more credibility than either.

## Design choices (and what was avoided on purpose)

Direction: a trade price list / spec sheet. Warm paper, black ink, kraft brown taken from the products, one stamp red used sparingly. Archivo Condensed for headings and IBM Plex Mono for sizes and prices. Square corners throughout.

Avoided because they mark a site as AI-generated:
- Purple/blue gradients, gradient text, glow, glassmorphism
- A centred hero with a pill badge above the headline
- Lucide-style icons in coloured rounded squares
- Three-up "feature" cards, "Why choose us", big stat counters
- Fake testimonials with avatar circles
- Rounded cards with drop shadows for every section
- Scroll-triggered fade-ins
- Generic copy such as "Elevate your brand" or "Seamless solutions"
- Inter + Tailwind indigo defaults

Each section is laid out for its content instead: categories as a price-list table, bulk pricing as a real price-break table, printing as terms plus numbered steps, customers as an inline list of names, and delivery as three plain columns.

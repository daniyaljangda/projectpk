/* ------------------------------------------------------------------
   Wisdom Traders — site data
   Everything the owner is likely to change lives in this one file:
   contact details, delivery terms, categories, products, customers.
   ------------------------------------------------------------------ */

window.WT = window.WT || {};

WT.business = {
  name: "Wisdom Traders",
  descriptor: "Packaging supply, Karachi",
  // TODO: replace with real details before launch
  phoneDisplay: "+92 300 000 0000",
  whatsapp: "923000000000",           // international format, digits only
  email: "orders@wisdomtraders.pk",
  addressLines: ["Karachi, Pakistan"],
  mapUrl: "https://maps.google.com/?q=Karachi",
  hours: "Monday to Saturday, 10am – 7pm",
  delivery: {
    karachi: "1–2 working days",
    outside: "3–5 working days",
    karachiFee: "Rs 250 flat in Karachi, free over Rs 15,000",
    outsideFee: "Courier charges by weight, quoted with your order",
  },
  payment: "Cash on delivery in Karachi. Bank transfer or Easypaisa / JazzCash for outside Karachi. Printed and custom orders need 100% advance.",
};

/* Categories, in the order they appear on the site. */
WT.categories = [
  { id: "food",       name: "Food & restaurant boxes", short: "Food boxes",   blurb: "Pizza, burger, cake and cupcake boxes in food-grade board, plus paper cups." },
  { id: "ecommerce",  name: "Mailer & product boxes",  short: "Mailers",      blurb: "Tuck-front mailers for online orders, shoe boxes and small retail cartons." },
  { id: "cartons",    name: "Shipping cartons",        short: "Cartons",      blurb: "3-ply and 5-ply corrugated cartons for moving, storage and courier." },
  { id: "bags",       name: "Bags, pouches & flyers",  short: "Bags",         blurb: "Kraft carry bags, food bags, stand-up zip pouches and courier flyers." },
  { id: "bottles",    name: "Bottles & jars",          short: "Bottles",      blurb: "Glass bottles, amber droppers and jars with metal lids." },
  { id: "stickers",   name: "Stickers, labels & tags", short: "Stickers",     blurb: "Printed round stickers, sheet labels, thank-you rolls and kraft hang tags." },
  { id: "tissues",    name: "Tissues & napkins",       short: "Tissues",      blurb: "Dinner napkins and tissue boxes for restaurants and offices." },
  { id: "accessories",name: "Packing accessories",     short: "Accessories",  blurb: "Tape, bubble wrap, shredded paper filler and wrapping tissue." },
  { id: "envelopes",  name: "Money envelopes",         short: "Envelopes",    blurb: "Eidi and shagun envelopes, ready-made or printed with your name." },
];

/* Products
   dims:   inches, [width, depth, height] for boxes; [width, height] for flat items
   breaks: [minimum quantity, price per unit in PKR] — first row is the minimum order
   unit:   what one "unit" is (pc, pack, roll, kg, box)
   NOTE: prices below are placeholders for layout — replace with the real price list. */
WT.products = [
  // Food & restaurant
  { id: "pizza-8",   cat: "food", name: "Pizza box 8\"",  shape: "pizza", dims: [8, 8, 1.5],   material: "E-flute corrugated, kraft outside, white inside", unit: "pc", breaks: [[50, 42], [100, 36], [500, 31], [1000, 28]], printable: true },
  { id: "pizza-10",  cat: "food", name: "Pizza box 10\"", shape: "pizza", dims: [10, 10, 1.75], material: "E-flute corrugated, kraft outside, white inside", unit: "pc", breaks: [[50, 52], [100, 45], [500, 39], [1000, 35]], printable: true },
  { id: "pizza-12",  cat: "food", name: "Pizza box 12\"", shape: "pizza", dims: [12, 12, 1.75], material: "E-flute corrugated, kraft outside, white inside", unit: "pc", breaks: [[50, 64], [100, 56], [500, 49], [1000, 44]], printable: true, popular: true },
  { id: "pizza-14",  cat: "food", name: "Pizza box 14\"", shape: "pizza", dims: [14, 14, 2],    material: "E-flute corrugated, kraft outside, white inside", unit: "pc", breaks: [[50, 78], [100, 68], [500, 60], [1000, 54]], printable: true },
  { id: "pizza-16",  cat: "food", name: "Pizza box 16\"", shape: "pizza", dims: [16, 16, 2],    material: "E-flute corrugated, kraft outside, white inside", unit: "pc", breaks: [[50, 96], [100, 84], [500, 74], [1000, 66]], printable: true },
  { id: "burger",    cat: "food", name: "Burger clamshell", shape: "burger", dims: [4.5, 4.5, 3.5], material: "300 gsm food-grade board, grease resistant", unit: "pc", breaks: [[100, 22], [500, 18], [1000, 15], [5000, 13]], printable: true, popular: true },
  { id: "fries",     cat: "food", name: "Fries box, medium", shape: "fries", dims: [3.5, 2, 3.5], material: "300 gsm food-grade board", unit: "pc", breaks: [[100, 14], [500, 11], [1000, 9], [5000, 8]], printable: true },
  { id: "cake-1",    cat: "food", name: "Cake box 1 lb, with window", shape: "cake", dims: [8, 8, 4],  material: "350 gsm white board, PET window", unit: "pc", breaks: [[50, 70], [100, 60], [500, 52], [1000, 46]], printable: true },
  { id: "cake-2",    cat: "food", name: "Cake box 2 lb, with window", shape: "cake", dims: [10, 10, 5], material: "350 gsm white board, PET window", unit: "pc", breaks: [[50, 92], [100, 80], [500, 70], [1000, 62]], printable: true },
  { id: "cupcake-6", cat: "food", name: "Cupcake box, 6 cavity", shape: "cake", dims: [9, 6, 3.5], material: "350 gsm white board, insert included", unit: "pc", breaks: [[50, 85], [100, 74], [500, 65], [1000, 58]], printable: true },
  { id: "cup-8",     cat: "food", name: "Paper cup 8 oz, double wall", shape: "cup", dims: [3.5, 3.7], material: "Double-wall paper, PE lined", unit: "pc", breaks: [[100, 18], [500, 15], [1000, 13], [5000, 11]], printable: true },

  // Mailers & product boxes
  { id: "mailer-s",  cat: "ecommerce", name: "Mailer box S", shape: "mailer", dims: [8, 6, 2],   material: "E-flute kraft, tuck-front", unit: "pc", breaks: [[50, 38], [100, 32], [500, 27], [1000, 24]], printable: true, popular: true },
  { id: "mailer-m",  cat: "ecommerce", name: "Mailer box M", shape: "mailer", dims: [10, 8, 3],  material: "E-flute kraft, tuck-front", unit: "pc", breaks: [[50, 52], [100, 45], [500, 38], [1000, 34]], printable: true },
  { id: "mailer-l",  cat: "ecommerce", name: "Mailer box L", shape: "mailer", dims: [12, 10, 4], material: "E-flute kraft, tuck-front", unit: "pc", breaks: [[50, 70], [100, 60], [500, 52], [1000, 46]], printable: true },
  { id: "shoe-box",  cat: "ecommerce", name: "Shoe box", shape: "mailer", dims: [13, 8, 5], material: "B-flute kraft", unit: "pc", breaks: [[50, 95], [100, 82], [500, 72], [1000, 65]], printable: true },
  { id: "tuck-tall", cat: "ecommerce", name: "Reverse tuck box (bottles, cosmetics)", shape: "tuck", dims: [2.5, 2.5, 6], material: "300 gsm white board", unit: "pc", breaks: [[100, 26], [500, 22], [1000, 18], [5000, 16]], printable: true },

  // Cartons
  { id: "carton-18", cat: "cartons", name: "Packing carton 18 × 18 × 10", shape: "carton", dims: [18, 18, 10], material: "5-ply corrugated", unit: "pc", breaks: [[10, 210], [50, 185], [200, 165], [500, 150]], popular: true },
  { id: "carton-12", cat: "cartons", name: "Carton 12 × 10 × 8", shape: "carton", dims: [12, 10, 8], material: "3-ply corrugated", unit: "pc", breaks: [[10, 95], [50, 82], [200, 72], [500, 64]] },
  { id: "carton-3kg",cat: "cartons", name: "3 kg box", shape: "carton", dims: [10, 8, 6], material: "3-ply corrugated", unit: "pc", breaks: [[25, 70], [100, 60], [500, 52], [1000, 46]] },
  { id: "cube-14",   cat: "cartons", name: "Cube carton 14 × 14 × 14", shape: "carton", dims: [14, 14, 14], material: "5-ply corrugated", unit: "pc", breaks: [[10, 230], [50, 200], [200, 180], [500, 165]] },
  { id: "frame",     cat: "cartons", name: "Frame carton 24 × 4 × 30", shape: "carton", dims: [24, 4, 30], material: "5-ply corrugated", unit: "pc", breaks: [[5, 320], [25, 280], [100, 250], [300, 230]] },

  // Bags
  { id: "bag-s",     cat: "bags", name: "Kraft bag with twisted handles, small", shape: "bag", dims: [8, 4, 10],  material: "120 gsm kraft paper", unit: "pc", breaks: [[50, 30], [100, 25], [500, 21], [1000, 18]], printable: true, popular: true },
  { id: "bag-l",     cat: "bags", name: "Kraft bag with twisted handles, large", shape: "bag", dims: [12, 5, 14], material: "120 gsm kraft paper", unit: "pc", breaks: [[50, 42], [100, 36], [500, 31], [1000, 28]], printable: true },
  { id: "bag-food",  cat: "bags", name: "Paper food bag (sandwich, naan)", shape: "sos", dims: [5, 3, 10], material: "50 gsm grease-resistant kraft", unit: "pc", breaks: [[200, 6], [1000, 5], [5000, 4], [10000, 3.5]], printable: true },
  { id: "pouch",     cat: "bags", name: "Stand-up zip pouch with window", shape: "pouch", dims: [6, 9], material: "Kraft / PE laminate, resealable zip", unit: "pc", breaks: [[50, 24], [100, 20], [500, 17], [1000, 15]], popular: true },
  { id: "flyer",     cat: "bags", name: "Courier flyer 10 × 14, tamper-proof", shape: "flyer", dims: [10, 14], material: "60 micron co-ex poly, grey inside", unit: "pc", breaks: [[100, 7], [500, 6], [1000, 5], [5000, 4.2]] },

  // Bottles & jars
  { id: "dropper-30",cat: "bottles", name: "Amber dropper bottle 30 ml", shape: "dropper", dims: [1.3, 3.8], material: "Amber glass, rubber bulb dropper", unit: "pc", breaks: [[24, 65], [100, 58], [500, 52], [1000, 48]] },
  { id: "bottle-250",cat: "bottles", name: "Glass bottle 250 ml with cap", shape: "bottle", dims: [2.4, 6.5], material: "Clear glass, metal screw cap", unit: "pc", breaks: [[24, 75], [100, 68], [500, 60], [1000, 55]] },
  { id: "jar-200",   cat: "bottles", name: "Glass jar 200 ml, gold lid", shape: "jar", dims: [2.8, 3.2], material: "Clear glass, lug lid", unit: "pc", breaks: [[24, 85], [100, 76], [500, 68], [1000, 62]] },
  { id: "jar-500",   cat: "bottles", name: "Glass jar 500 ml, gold lid", shape: "jar", dims: [3.4, 4.6], material: "Clear glass, lug lid", unit: "pc", breaks: [[24, 110], [100, 98], [500, 88], [1000, 80]] },

  // Stickers
  { id: "sticker-round", cat: "stickers", name: "Round sticker 2\", printed with your logo", shape: "sticker", dims: [2, 2], material: "Gloss vinyl, kiss-cut", unit: "pc", breaks: [[50, 12], [500, 9], [1000, 6], [5000, 4.5]], printable: true, needsArtwork: true, popular: true },
  { id: "label-sheet",   cat: "stickers", name: "Rectangle label 3 × 2\", printed", shape: "labels", dims: [3, 2], material: "Matte paper, on A4 sheets", unit: "pc", breaks: [[50, 10], [500, 7], [1000, 5], [5000, 3.8]], printable: true, needsArtwork: true },
  { id: "thanks-roll",   cat: "stickers", name: "\"Thank you\" sticker roll, 500 pcs", shape: "roll", dims: [1.5, 1.5], material: "Ready stock, 1.5\" round", unit: "roll", breaks: [[1, 1450], [5, 1300], [10, 1200], [25, 1100]] },
  { id: "hang-tag",      cat: "stickers", name: "Kraft hang tag with string", shape: "tag", dims: [2, 3.5], material: "350 gsm kraft, cotton string", unit: "pc", breaks: [[100, 9], [500, 7], [1000, 6], [5000, 5]], printable: true },

  // Tissues
  { id: "napkin",    cat: "tissues", name: "Dinner napkin 2-ply, pack of 100", shape: "napkins", dims: [6.5, 6.5], material: "2-ply virgin tissue, 33 × 33 cm unfolded", unit: "pack", breaks: [[5, 220], [20, 195], [50, 180], [100, 165]] },
  { id: "tissue-box",cat: "tissues", name: "Tissue box, 100 pulls", shape: "tissue", dims: [9, 4.5, 3.5], material: "2-ply facial tissue", unit: "box", breaks: [[6, 160], [24, 140], [60, 125], [120, 115]], printable: true },

  // Accessories
  { id: "tape",      cat: "accessories", name: "Brown packing tape 2\" × 100 yd", shape: "tape", dims: [2, 3], material: "BOPP, 45 micron", unit: "roll", breaks: [[6, 180], [36, 160], [72, 145], [144, 135]], popular: true },
  { id: "bubble",    cat: "accessories", name: "Bubble wrap roll 1 m × 50 m", shape: "bubble", dims: [40, 12], material: "10 mm bubble, 50 micron", unit: "roll", breaks: [[1, 2900], [5, 2700], [10, 2550], [25, 2400]] },
  { id: "shred",     cat: "accessories", name: "Shredded paper filler, 1 kg", shape: "shred", dims: [0, 0], material: "Kraft crinkle-cut", unit: "kg", breaks: [[1, 650], [5, 600], [20, 560], [50, 520]] },
  { id: "wrap-tissue", cat: "accessories", name: "Wrapping tissue 20 × 30, pack of 100", shape: "sheets", dims: [20, 30], material: "17 gsm acid-free tissue, white or black", unit: "pack", breaks: [[1, 950], [5, 880], [20, 820], [50, 780]] },

  // Envelopes
  { id: "eidi",      cat: "envelopes", name: "Eidi envelope, pack of 10", shape: "envelope", dims: [7, 3.5], material: "Textured card, foil print, assorted colours", unit: "pack", breaks: [[5, 250], [20, 220], [50, 195], [100, 175]] },
  { id: "env-custom",cat: "envelopes", name: "Envelope printed with your name", shape: "envelope", dims: [7, 3.5], material: "Textured card, single-colour foil", unit: "pc", breaks: [[200, 28], [500, 22], [1000, 18], [2000, 15]], printable: true, needsArtwork: true },
];

/* Customers shown on the home and about pages.
   PLACEHOLDER NAMES — swap in real customers (with their permission).
   `type` and `city` are shown in small text next to each name. */
WT.customers = [
  { name: "Dough Bros",         type: "Pizzeria",        city: "Karachi" },
  { name: "Noor Organics",      type: "Skincare",        city: "Lahore" },
  { name: "Tandoor Street",     type: "Restaurant",      city: "Karachi" },
  { name: "Kapra House",        type: "Clothing",        city: "Karachi" },
  { name: "Bake Lab",           type: "Home bakery",     city: "Karachi" },
  { name: "Shahi Mithai",       type: "Sweets",          city: "Hyderabad" },
  { name: "Ghar ka Achar",      type: "Pickles",         city: "Karachi" },
  { name: "Lamp & Loom",        type: "Homeware",        city: "Islamabad" },
  { name: "Clifton Burger Co.", type: "Burgers",         city: "Karachi" },
  { name: "Zaib Candles",       type: "Candles",         city: "Lahore" },
  { name: "Pet Pantry",         type: "Pet food",        city: "Karachi" },
  { name: "Chai Point 21",      type: "Café",            city: "Karachi" },
];

/* ------------------------------------------------------------------
   Product drawings.
   Every product is drawn as a flat-shaded isometric line drawing
   (boxes, bags) or a simple elevation (bottles, pouches, flyers),
   generated from the dimensions in data.js. No stock photos.
   Swap for real photography later by adding `photo` to a product.
   ------------------------------------------------------------------ */
(function () {
  const C = Math.cos(Math.PI / 6), S = 0.5;
  const INK = "#1E1B16";
  const TONES = {
    kraft: ["#E4CA9C", "#CBA66F", "#B48E58"],
    white: ["#FBF8F1", "#ECE5D7", "#DAD1BF"],
    brown: ["#C99E66", "#AE8450", "#966F42"],
    grey:  ["#E3E3DF", "#CFCFCA", "#BBBBB5"],
    dark:  ["#3A3630", "#2C2924", "#211F1B"],
  };
  const GLASS = "#E6EAE4", AMBER = "#8E5320", TAPE = "#B98447", PAPER = "#FBF8F1", RED = "#C4361C";

  function P(x, y, z) { return [(x - y) * C, (x + y) * S - z]; }
  const f = (n) => Math.round(n * 100) / 100;
  const pts = (arr) => arr.map((p) => f(p[0]) + "," + f(p[1])).join(" ");

  function Scene() {
    this.out = [];
    this.b = [Infinity, Infinity, -Infinity, -Infinity];
  }
  Scene.prototype.ext = function (list) {
    for (const p of list) {
      if (p[0] < this.b[0]) this.b[0] = p[0];
      if (p[1] < this.b[1]) this.b[1] = p[1];
      if (p[0] > this.b[2]) this.b[2] = p[0];
      if (p[1] > this.b[3]) this.b[3] = p[1];
    }
  };
  Scene.prototype.poly = function (list, fill, extra) {
    this.ext(list);
    this.out.push(`<polygon points="${pts(list)}" fill="${fill || "none"}" ${extra || ""}/>`);
  };
  Scene.prototype.line = function (list, extra) {
    this.ext(list);
    this.out.push(`<polyline points="${pts(list)}" fill="none" ${extra || ""}/>`);
  };
  Scene.prototype.path = function (d, fill, boundsPts, extra) {
    if (boundsPts) this.ext(boundsPts);
    this.out.push(`<path d="${d}" fill="${fill || "none"}" ${extra || ""}/>`);
  };
  Scene.prototype.raw = function (s, boundsPts) {
    if (boundsPts) this.ext(boundsPts);
    this.out.push(s);
  };
  Scene.prototype.svg = function (label, padRatio) {
    const [x0, y0, x1, y1] = this.b;
    const w = x1 - x0, h = y1 - y0;
    const pad = Math.max(w, h) * (padRatio == null ? 0.08 : padRatio);
    const vb = [x0 - pad, y0 - pad, w + pad * 2, h + pad * 2].map(f).join(" ");
    return `<svg class="drawing" viewBox="${vb}" role="img" aria-label="${label || ""}" xmlns="http://www.w3.org/2000/svg">` +
      `<g stroke="${INK}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke">` +
      this.out.join("").replace(/<(polygon|polyline|path|ellipse|rect|circle|line)/g, '<$1 vector-effect="non-scaling-stroke"') +
      `</g></svg>`;
  };

  /* ---------- isometric box with face decorations ---------- */
  function box(sc, o, w, d, h, tone, kind) {
    const q = (x, y, z) => P(o[0] + x, o[1] + y, o[2] + z);
    const t = TONES[tone] || TONES.kraft;
    const top = [q(0, 0, h), q(w, 0, h), q(w, d, h), q(0, d, h)];
    const left = [q(0, d, 0), q(w, d, 0), q(w, d, h), q(0, d, h)];
    const right = [q(w, 0, 0), q(w, d, 0), q(w, d, h), q(w, 0, h)];
    const thin = 'stroke-width="0.9"';

    if (kind === "bag") {
      // back handle sits behind the bag
      handle(sc, q(w * 0.3, d * 0.15, h), q(w * 0.7, d * 0.15, h), h * 0.38);
    }
    if (kind === "fries") {
      sc.poly(top, t[2]);
      const yel = "#E8B64A";
      const sticks = [0.18, 0.3, 0.42, 0.55, 0.66, 0.8];
      sticks.forEach((sx, i) => {
        const base = q(w * sx, d * 0.5, h * 0.7);
        const tipH = h * (0.45 + ((i * 37) % 5) * 0.06);
        const lean = (i % 2 ? 1 : -1) * w * 0.03;
        const sw = w * 0.06;
        sc.poly([[base[0] - sw, base[1]], [base[0] + sw, base[1]], [base[0] + sw + lean, base[1] - tipH], [base[0] - sw + lean, base[1] - tipH]], yel, thin);
      });
    } else if (kind === "bag" || kind === "sos") {
      sc.poly(top, "#7A5A33");
    } else {
      sc.poly(top, t[0]);
    }
    sc.poly(left, t[1]);
    sc.poly(right, t[2]);

    const L = (a, b, extra) => sc.line([a, b], extra || thin);

    switch (kind) {
      case "pizza": {
        L(q(0, d, h * 0.62), q(w, d, h * 0.62));
        L(q(w, 0, h * 0.62), q(w, d, h * 0.62));
        // vent holes on the lid edge
        const r = Math.min(w, d) * 0.03;
        [0.25, 0.75].forEach((s) => {
          const c = q(w * s, d, h * 0.82);
          sc.raw(`<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(r)}" ry="${f(r * 0.55)}" fill="${INK}" stroke="none"/>`);
        });
        break;
      }
      case "mailer": {
        L(q(0, d, h * 0.72), q(w, d, h * 0.72));
        const r = Math.min(w * 0.08, h * 0.35);
        const notch = [];
        for (let i = 0; i <= 12; i++) {
          const a = Math.PI * (i / 12);
          notch.push(q(w / 2 + r * Math.cos(a), d, h - r * Math.sin(a) * 0.9));
        }
        sc.poly(notch, t[2], thin);
        break;
      }
      case "carton": {
        const tw = Math.min(d, w) * 0.07;
        const drop = h * 0.3;
        sc.poly([q(0, d / 2 - tw, h), q(w, d / 2 - tw, h), q(w, d / 2 + tw, h), q(0, d / 2 + tw, h)], TAPE, thin);
        sc.poly([q(w, d / 2 - tw, h), q(w, d / 2 + tw, h), q(w, d / 2 + tw, h - drop), q(w, d / 2 - tw, h - drop)], "#A3733C", thin);
        L(q(0, d / 2, h), q(w, d / 2, h), 'stroke-width="0.6" stroke-dasharray="2 2"');
        // "this way up" arrows on the front face
        if (h > 4 && w > 6) {
          [0.12, 0.2].forEach((s) => {
            const x = w * s, z0 = h * 0.55, z1 = h * 0.8, ah = h * 0.07, aw = w * 0.025;
            L(q(x, d, z0), q(x, d, z1), 'stroke-width="1.1"');
            sc.line([q(x - aw, d, z1 - ah), q(x, d, z1), q(x + aw, d, z1 - ah)], 'stroke-width="1.1"');
          });
          L(q(w * 0.08, d, h * 0.47), q(w * 0.24, d, h * 0.47), 'stroke-width="1.1"');
        }
        break;
      }
      case "burger": {
        L(q(0, d, h * 0.45), q(w, d, h * 0.45));
        L(q(w, 0, h * 0.45), q(w, d, h * 0.45));
        // locking tab
        sc.poly([q(w * 0.4, d, h * 0.45), q(w * 0.6, d, h * 0.45), q(w * 0.56, d, h * 0.3), q(w * 0.44, d, h * 0.3)], t[1], thin);
        break;
      }
      case "cake": {
        sc.poly([q(w * 0.2, d * 0.2, h), q(w * 0.8, d * 0.2, h), q(w * 0.8, d * 0.8, h), q(w * 0.2, d * 0.8, h)], GLASS, thin);
        sc.line([q(w * 0.28, d * 0.3, h), q(w * 0.4, d * 0.3, h)], 'stroke="#FFFFFF" stroke-width="2"');
        L(q(0, d, h * 0.82), q(w, d, h * 0.82));
        L(q(w, 0, h * 0.82), q(w, d, h * 0.82));
        break;
      }
      case "tuck": {
        L(q(0, d * 0.82, h), q(w, d * 0.82, h));
        L(q(0, d, h * 0.93), q(w, d, h * 0.93));
        break;
      }
      case "tissue": {
        const e = [];
        for (let i = 0; i < 24; i++) {
          const a = (Math.PI * 2 * i) / 24;
          e.push(q(w / 2 + w * 0.3 * Math.cos(a), d / 2 + d * 0.16 * Math.sin(a), h));
        }
        sc.poly(e, "#3A3630", thin);
        const c = q(w / 2, d / 2, h);
        const s = w * 0.18;
        const d1 = `M${f(c[0] - s)},${f(c[1])} Q${f(c[0] - s * 0.6)},${f(c[1] - s * 1.6)} ${f(c[0] + s * 0.1)},${f(c[1] - s * 1.3)} Q${f(c[0] + s * 0.9)},${f(c[1] - s * 1.1)} ${f(c[0] + s)},${f(c[1] + s * 0.1)} Z`;
        sc.path(d1, PAPER, [[c[0] - s, c[1] - s * 1.6], [c[0] + s, c[1]]]);
        // printed band
        sc.poly([q(0, d, h * 0.3), q(w, d, h * 0.3), q(w, d, h * 0.42), q(0, d, h * 0.42)], RED, 'stroke="none"');
        break;
      }
      case "bag":
      case "sos": {
        L(q(0, d, h * 0.88), q(w, d, h * 0.88));
        L(q(w, 0, h * 0.88), q(w, d, h * 0.88));
        // side gusset fold
        sc.line([q(w, d / 2, h), q(w, d / 2, h * 0.12), q(w, 0, 0)], thin);
        sc.line([q(w, d / 2, h * 0.12), q(w, d, 0)], thin);
        if (kind === "bag") handle(sc, q(w * 0.3, d, h), q(w * 0.7, d, h), h * 0.38);
        break;
      }
    }
  }

  function handle(sc, a, b, rise) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - rise;
    const d = `M${f(a[0])},${f(a[1])} C${f(a[0])},${f(my)} ${f(b[0])},${f(my)} ${f(b[0])},${f(b[1])}`;
    sc.path(d, "none", [a, b, [mx, my + rise * 0.25]], 'stroke="#7A5A33" stroke-width="2.6"');
    sc.path(d, "none", null, 'stroke="#C9A56E" stroke-width="1" stroke-dasharray="1.5 2"');
  }

  /* ---------- cylinders (screen space) ---------- */
  function cylinder(sc, cx, cy, rx, ry, hgt, fill, sideFill) {
    const top = cy - hgt;
    sc.path(`M${f(cx - rx)},${f(top)} L${f(cx - rx)},${f(cy)} A${f(rx)},${f(ry)} 0 0 0 ${f(cx + rx)},${f(cy)} L${f(cx + rx)},${f(top)} Z`, sideFill || fill,
      [[cx - rx, top - ry], [cx + rx, cy + ry]]);
    sc.raw(`<ellipse cx="${f(cx)}" cy="${f(top)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"/>`);
    return top;
  }

  /* ---------- per-shape drawings ---------- */
  const SHAPES = {
    pizza:  (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "kraft", "pizza"),
    mailer: (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "kraft", "mailer"),
    carton: (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "brown", "carton"),
    burger: (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "white", "burger"),
    fries:  (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "white", "fries"),
    cake:   (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "white", "cake"),
    tuck:   (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "white", "tuck"),
    tissue: (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "white", "tissue"),
    bag:    (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "kraft", "bag"),
    sos:    (sc, p) => box(sc, [0, 0, 0], p.dims[0], p.dims[1], p.dims[2], "kraft", "sos"),

    napkins: (sc) => {
      for (let i = 0; i < 4; i++) box(sc, [i * 0.15, -i * 0.1, i * 0.55], 6.5, 6.5, 0.55, "white", "plain");
      sc.poly([P(0.45, 6.2, 2.2), P(6.95, 6.2, 2.2), P(6.95, 6.2, 1.85), P(0.45, 6.2, 1.85)], RED, 'stroke="none"');
    },
    sheets: (sc) => {
      for (let i = 0; i < 6; i++) box(sc, [i * 0.25, i * 0.12, i * 0.22], 14, 20, 0.22, i % 2 ? "grey" : "white", "plain");
    },

    pouch: (sc, p) => {
      const W = p.dims[0] * 10, H = p.dims[1] * 10;
      sc.path(`M0,0 L${W},0 L${W},${H * 0.9} Q${W * 0.5},${H * 1.04} 0,${H * 0.9} Z`, TONES.kraft[1], [[0, 0], [W, H * 1.0]]);
      sc.raw(`<rect x="${W * 0.86}" y="0" width="${W * 0.14}" height="${H * 0.895}" fill="${TONES.kraft[2]}" stroke="none"/>`);
      sc.raw(`<rect x="${W * 0.2}" y="${H * 0.42}" width="${W * 0.6}" height="${H * 0.32}" fill="${GLASS}" stroke-width="0.9"/>`);
      sc.line([[0, H * 0.13], [W, H * 0.13]], 'stroke-width="1" stroke-dasharray="3 2"');
      sc.line([[0, H * 0.06], [W * 0.06, H * 0.06]], 'stroke-width="0.9"');
      sc.raw(`<rect x="${W * 0.2}" y="${H * 0.22}" width="${W * 0.45}" height="${H * 0.1}" fill="${PAPER}" stroke-width="0.9"/>`);
      sc.path(`M0,0 L${W},0 L${W},${H * 0.9} Q${W * 0.5},${H * 1.04} 0,${H * 0.9} Z`, "none");
    },
    flyer: (sc, p) => {
      const W = p.dims[0] * 10, H = p.dims[1] * 10;
      sc.poly([[0, 0], [W, 0], [W, H], [0, H]], "#D9DAD6");
      sc.poly([[0, 0], [W, 0], [W, H * 0.09], [0, H * 0.09]], "#C2C3BE", 'stroke-width="0.9"');
      sc.line([[W * 0.04, H * 0.045], [W * 0.96, H * 0.045]], 'stroke-width="0.8" stroke-dasharray="4 3"');
      sc.raw(`<rect x="${W * 0.55}" y="${H * 0.6}" width="${W * 0.36}" height="${H * 0.28}" fill="${PAPER}" stroke-width="0.9"/>`);
      for (let i = 0; i < 4; i++) sc.line([[W * 0.59, H * (0.66 + i * 0.05)], [W * (0.84 - (i % 2) * 0.1), H * (0.66 + i * 0.05)]], 'stroke-width="0.8"');
    },
    bottle: (sc, p) => {
      const W = p.dims[0] * 10, H = p.dims[1] * 10;
      const nw = W * 0.34, sh = H * 0.36, nk = H * 0.13;
      const x0 = -W / 2, x1 = W / 2;
      const d = `M${-nw / 2},${nk} L${-nw / 2},${sh * 0.6} Q${x0},${sh * 0.75} ${x0},${sh + W * 0.15} L${x0},${H - 4} Q${x0},${H} ${x0 + 4},${H} L${x1 - 4},${H} Q${x1},${H} ${x1},${H - 4} L${x1},${sh + W * 0.15} Q${x1},${sh * 0.75} ${nw / 2},${sh * 0.6} L${nw / 2},${nk} Z`;
      sc.path(d, GLASS, [[x0, 0], [x1, H]]);
      sc.raw(`<rect x="${x0 + W * 0.12}" y="${sh + W * 0.3}" width="${W * 0.08}" height="${H * 0.36}" fill="#FFFFFF" stroke="none"/>`);
      sc.raw(`<rect x="${x0}" y="${H * 0.55}" width="${W}" height="${H * 0.25}" fill="${PAPER}" stroke-width="0.9"/>`);
      sc.raw(`<rect x="${-nw / 2 - 1.5}" y="0" width="${nw + 3}" height="${nk}" fill="#9B9A93"/>`);
      for (let i = 1; i < 5; i++) sc.line([[-nw / 2 - 1.5 + i * (nw + 3) / 5, 0], [-nw / 2 - 1.5 + i * (nw + 3) / 5, nk]], 'stroke-width="0.6"');
    },
    dropper: (sc, p) => {
      const W = p.dims[0] * 10, H = p.dims[1] * 10;
      const body = H * 0.62, top = H - body;
      sc.raw(`<rect x="${-W / 2}" y="${top}" width="${W}" height="${body}" rx="3" fill="${AMBER}"/>`, [[-W / 2, 0], [W / 2, H]]);
      sc.raw(`<rect x="${-W / 2 + W * 0.14}" y="${top + body * 0.12}" width="${W * 0.1}" height="${body * 0.7}" fill="#B87A3E" stroke="none"/>`);
      sc.raw(`<rect x="${-W / 2}" y="${top + body * 0.35}" width="${W}" height="${body * 0.38}" fill="${PAPER}" stroke-width="0.9"/>`);
      sc.raw(`<rect x="${-W * 0.3}" y="${top - H * 0.1}" width="${W * 0.6}" height="${H * 0.1}" fill="${INK}"/>`);
      sc.path(`M${-W * 0.22},${top - H * 0.1} L${-W * 0.22},${H * 0.08} Q0,${-H * 0.04} ${W * 0.22},${H * 0.08} L${W * 0.22},${top - H * 0.1} Z`, "#3A3630");
    },
    jar: (sc, p) => {
      const W = p.dims[0] * 10, H = p.dims[1] * 10;
      const lid = H * 0.18;
      sc.raw(`<rect x="${-W / 2}" y="${lid * 0.9}" width="${W}" height="${H - lid * 0.9}" rx="${W * 0.12}" fill="${GLASS}"/>`, [[-W / 2, 0], [W / 2, H]]);
      sc.raw(`<rect x="${-W / 2 + W * 0.1}" y="${lid * 1.6}" width="${W * 0.07}" height="${H * 0.5}" fill="#FFFFFF" stroke="none"/>`);
      sc.raw(`<rect x="${-W / 2}" y="${H * 0.42}" width="${W}" height="${H * 0.3}" fill="${PAPER}" stroke-width="0.9"/>`);
      sc.raw(`<rect x="${-W * 0.46}" y="0" width="${W * 0.92}" height="${lid}" rx="2" fill="#C9A24A"/>`);
      sc.line([[-W * 0.46, lid * 0.3], [W * 0.46, lid * 0.3]], 'stroke-width="0.7"');
    },
    sticker: (sc) => {
      sc.raw(`<rect x="0" y="0" width="60" height="44" fill="${PAPER}"/>`, [[0, 0], [60, 44]]);
      [[16, 14], [44, 14], [16, 32]].forEach(([x, y]) => {
        sc.raw(`<circle cx="${x}" cy="${y}" r="8.5" fill="${RED}"/><circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#FBF8F1" stroke-width="0.8"/>`);
      });
      // one sticker half-peeled
      sc.raw(`<circle cx="44" cy="32" r="8.5" fill="none" stroke-dasharray="1.5 1.5" stroke-width="0.7"/>`);
      sc.path(`M37,36 A8.5,8.5 0 0 1 51,27 L53,40 Q45,44 37,36 Z`, RED);
      sc.path(`M51,27 L53,40 Q50,35 51,27 Z`, "#8F2612");
    },
    labels: (sc) => {
      sc.raw(`<rect x="0" y="0" width="50" height="66" fill="${PAPER}"/>`, [[0, 0], [50, 66]]);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) {
        const x = 4 + c * 22, y = 4 + r * 15.5;
        sc.raw(`<rect x="${x}" y="${y}" width="20" height="13" rx="1.5" fill="${r === 0 && c === 1 ? "none" : "#EDE6D6"}" stroke-width="0.8" ${r === 0 && c === 1 ? 'stroke-dasharray="1.5 1.5"' : ""}/>`);
        if (!(r === 0 && c === 1)) {
          sc.line([[x + 3, y + 5], [x + 15, y + 5]], 'stroke-width="1.2"');
          sc.line([[x + 3, y + 8.5], [x + 11, y + 8.5]], 'stroke-width="0.7"');
        }
      }
    },
    roll: (sc) => {
      sc.raw(`<circle cx="30" cy="30" r="28" fill="${PAPER}"/><circle cx="30" cy="30" r="12" fill="${TONES.kraft[1]}"/><circle cx="30" cy="30" r="9" fill="#F3EEE4"/>`, [[2, 2], [58, 58]]);
      for (let i = 0; i < 3; i++) sc.raw(`<circle cx="30" cy="30" r="${16 + i * 4}" fill="none" stroke-width="0.4"/>`);
      sc.path(`M30,58 L74,58 L74,46 L44,46 Q36,50 30,58 Z`, PAPER, [[30, 46], [74, 58]]);
      [52, 64].forEach((x) => sc.raw(`<circle cx="${x}" cy="52" r="4.6" fill="${RED}" stroke="none"/>`));
    },
    tag: (sc) => {
      sc.path(`M8,0 L28,0 L36,8 L36,64 L0,64 L0,8 Z`, TONES.kraft[1], [[0, -14], [36, 64]]);
      sc.raw(`<circle cx="18" cy="10" r="3" fill="#F3EEE4"/>`);
      sc.path(`M18,10 C6,-12 34,-14 30,-2 C27,6 22,4 20,12`, "none", null, 'stroke-width="1.1"');
      sc.line([[7, 32], [29, 32]], 'stroke-width="1.6"');
      sc.line([[7, 39], [24, 39]], 'stroke-width="0.8"');
    },
    tape: (sc) => {
      const top = cylinder(sc, 0, 0, 30, 15, 14, "#C6955A", TAPE);
      sc.raw(`<ellipse cx="0" cy="${top}" rx="17" ry="8.5" fill="${TONES.kraft[0]}"/><ellipse cx="0" cy="${top}" rx="13" ry="6.5" fill="#F3EEE4"/>`);
      sc.path(`M28,-2 L44,6 L44,19 L28,11 Z`, "#C6955A", [[28, -2], [44, 19]]);
    },
    bubble: (sc) => {
      const top = cylinder(sc, 0, 0, 22, 11, 64, "#EEF1EE", "#E2E7E3");
      for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) {
        const x = -17 + c * 7 + (r % 2) * 3.5, y = top + 10 + r * 8.2;
        if (x < 20) sc.raw(`<circle cx="${x}" cy="${y}" r="2.2" fill="#FFFFFF" stroke-width="0.5"/>`);
      }
      sc.raw(`<ellipse cx="0" cy="${top}" rx="6" ry="3" fill="${TONES.kraft[1]}"/>`);
      sc.path(`M22,-8 L48,4 L48,14 Q35,14 22,4 Z`, "#E2E7E3", [[22, -8], [48, 14]]);
    },
    cup: (sc) => {
      const rt = 18, rb = 13, h = 44, ryT = 7, ryB = 5;
      sc.path(`M${-rt},0 L${-rb},${h} A${rb},${ryB} 0 0 0 ${rb},${h} L${rt},0 Z`, PAPER, [[-rt, -ryT], [rt, h + ryB]]);
      sc.path(`M${-rt + 1.6},11 L${-rb - 1.4},${h - 9} L${rb + 1.4},${h - 9} L${rt - 1.6},11 Z`, TONES.kraft[1], null, 'stroke-width="0.9"');
      sc.raw(`<ellipse cx="0" cy="0" rx="${rt}" ry="${ryT}" fill="#E8E1D2"/><ellipse cx="0" cy="0" rx="${rt - 2}" ry="${ryT - 1.4}" fill="#D8CFBC" stroke-width="0.6"/>`);
    },
    envelope: (sc, p) => {
      const W = p.dims[0] * 10, H = p.dims[1] * 10;
      const fill = p.id === "eidi" ? "#2F5D50" : RED;
      sc.poly([[0, 0], [W, 0], [W, H], [0, H]], fill);
      sc.poly([[0, 0], [W, 0], [W / 2, H * 0.55]], fill === RED ? "#A82D17" : "#264C41", 'stroke-width="0.9"');
      sc.raw(`<circle cx="${W / 2}" cy="${H * 0.55}" r="${H * 0.1}" fill="#C9A24A" stroke-width="0.8"/>`);
      sc.line([[W * 0.08, H * 0.82], [W * 0.3, H * 0.82]], 'stroke="#C9A24A" stroke-width="1.2"');
    },
    shred: (sc) => {
      sc.path(`M0,40 Q8,6 34,4 Q60,2 70,40 Z`, TONES.kraft[1], [[0, 2], [70, 40]]);
      const zz = (x, y, n, s) => {
        const a = [];
        for (let i = 0; i <= n; i++) a.push([x + i * s, y + (i % 2 ? -2.2 : 2.2)]);
        return a;
      };
      [[8, 32, 8, 4.2], [14, 22, 9, 4], [20, 14, 7, 4.2], [30, 28, 8, 4], [38, 18, 6, 4], [12, 36, 12, 4], [28, 9, 4, 4]].forEach(([x, y, n, s]) =>
        sc.line(zz(x, y, n, s), 'stroke-width="0.9" stroke="#6B4E2A"'));
      sc.line([[-4, 40], [74, 40]], 'stroke-width="1.3"');
    },
  };

  /* ---------- dimension lines for box shapes ---------- */
  const BOXY = ["pizza", "mailer", "carton", "burger", "fries", "cake", "tuck", "tissue", "bag", "sos"];

  function dims(sc, w, d, h) {
    const span = (w + d) * C;
    const off = span * 0.1, fs = Math.max(span * 0.055, 0.6);
    const ext = 'stroke-width="0.6" stroke="#6B6458"';
    const dim = 'stroke-width="0.9" stroke="#6B6458"';
    const label = (x, y, rot, text) => sc.raw(
      `<text x="${f(x)}" y="${f(y)}" transform="rotate(${rot} ${f(x)} ${f(y)})" font-size="${f(fs)}" class="dim-text" text-anchor="middle" fill="#1E1B16" stroke="none">${text}</text>`);

    // width: along x, front-left bottom edge, pushed out in +y
    const a = P(0, d, 0), b = P(w, d, 0), a2 = P(0, d + off, 0), b2 = P(w, d + off, 0);
    sc.line([a, a2], ext); sc.line([b, b2], ext); sc.line([a2, b2], dim);
    label((a2[0] + b2[0]) / 2 - fs * 0.5 * S, (a2[1] + b2[1]) / 2 + fs * 1.15, 30, fmtIn(w));

    // depth: along y, front-right bottom edge, pushed out in +x
    const c = P(w, 0, 0), e = P(w, d, 0), c2 = P(w + off, 0, 0), e2 = P(w + off, d, 0);
    sc.line([c, c2], ext); sc.line([e, e2], ext); sc.line([c2, e2], dim);
    label((c2[0] + e2[0]) / 2 + fs * 0.5 * S, (c2[1] + e2[1]) / 2 + fs * 1.15, -30, fmtIn(d));

    // height: vertical edge at the far-left corner, pushed out in screen -x
    const g = P(0, d, 0), k = P(0, d, h);
    const gx = g[0] - off * 0.9;
    sc.line([g, [gx, g[1]]], ext); sc.line([k, [gx, k[1]]], ext); sc.line([[gx, g[1]], [gx, k[1]]], dim);
    label(gx - fs * 0.45, (g[1] + k[1]) / 2, -90, fmtIn(h));
  }

  function fmtIn(n) { return (Math.round(n * 100) / 100) + " in"; }

  /* ---------- public API ---------- */
  WT.draw = function (p, opts) {
    opts = opts || {};
    const sc = new Scene();
    (SHAPES[p.shape] || SHAPES.carton)(sc, p);
    if (opts.dims && BOXY.includes(p.shape)) dims(sc, p.dims[0], p.dims[1], p.dims[2]);
    return sc.svg(p.name, opts.pad);
  };

  /* The hero drawing: a stack of the things people actually order. */
  WT.drawHero = function () {
    const sc = new Scene();
    box(sc, [0, 0, 0], 18, 18, 10, "brown", "carton");
    box(sc, [2, 2, 10], 14, 14, 2, "kraft", "pizza");
    box(sc, [4, 5, 12], 10, 8, 3, "kraft", "mailer");
    box(sc, [20, 6, 0], 8, 4, 10, "kraft", "bag");
    box(sc, [9, 21, 0], 4.5, 4.5, 3.5, "white", "burger");
    // a cup next to the burger box
    const base = P(16.5, 23.5, 0);
    const rt = 2.2 * C * 1.6, rb = 1.6 * C * 1.6, ht = 5.4;
    sc.path(`M${f(base[0] - rt)},${f(base[1] - ht)} L${f(base[0] - rb)},${f(base[1])} A${f(rb)},${f(rb * 0.5)} 0 0 0 ${f(base[0] + rb)},${f(base[1])} L${f(base[0] + rt)},${f(base[1] - ht)} Z`, PAPER,
      [[base[0] - rt, base[1] - ht - 2], [base[0] + rt, base[1] + 1]]);
    sc.path(`M${f(base[0] - rt + 0.25)},${f(base[1] - ht + 1.4)} L${f(base[0] - rb - 0.2)},${f(base[1] - 1.1)} L${f(base[0] + rb + 0.2)},${f(base[1] - 1.1)} L${f(base[0] + rt - 0.25)},${f(base[1] - ht + 1.4)} Z`, RED, null, 'stroke-width="0.9"');
    sc.raw(`<ellipse cx="${f(base[0])}" cy="${f(base[1] - ht)}" rx="${f(rt)}" ry="${f(rt * 0.42)}" fill="#E8E1D2"/>`);
    return sc.svg("A carton with a pizza box, a mailer box, a kraft carry bag, a burger box and a paper cup", 0.04);
  };
})();

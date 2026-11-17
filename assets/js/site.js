/* Wisdom Traders — shared layout, order list, and page renderers. */
(function () {
  const B = WT.business;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- money & pricing ---------- */
  const rs = (n) => "Rs " + (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const qtyFmt = (n) => Number(n).toLocaleString("en-US");
  const byId = (id) => WT.products.find((p) => p.id === id);
  const catById = (id) => WT.categories.find((c) => c.id === id);
  const moq = (p) => p.breaks[0][0];
  const unitPrice = (p, q) => {
    let price = p.breaks[0][1];
    for (const [min, pr] of p.breaks) if (q >= min) price = pr;
    return price;
  };
  const unitLabel = (p, n) => {
    const u = p.unit || "pc";
    if (u === "pc") return n === 1 ? "pc" : "pcs";
    if (u === "box") return n === 1 ? "box" : "boxes";
    return n === 1 ? u : u + "s";
  };
  const sizeText = (p) => {
    const d = p.dims || [];
    if (p.shape === "shred" || !d.length) return "";
    if (d.length === 3) return `${d[0]} × ${d[1]} × ${d[2]} in`;
    if (["bottle", "jar", "dropper", "cup"].includes(p.shape)) return `Ø ${d[0]} × ${d[1]} in`;
    if (p.shape === "bubble") return "";
    if (p.shape === "tape") return "";
    return `${d[0]} × ${d[1]} in`;
  };
  WT.util = { rs, unitPrice, moq, byId };

  /* ---------- order list (localStorage, fails soft) ---------- */
  const KEY = "wt-order-v1";
  let memory = {};
  const Order = {
    read() {
      try { const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return v && typeof v === "object" ? v : {}; }
      catch (e) { return memory; }
    },
    write(o) {
      memory = o;
      try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
      document.dispatchEvent(new CustomEvent("order:change"));
    },
    lines() {
      const o = this.read();
      return Object.keys(o).map((id) => ({ p: byId(id), q: o[id] })).filter((l) => l.p && l.q > 0);
    },
    set(id, q) { const o = this.read(); if (q > 0) o[id] = q; else delete o[id]; this.write(o); },
    add(id, q) { const o = this.read(); o[id] = (o[id] || 0) + q; this.write(o); },
    count() { return this.lines().length; },
  };
  WT.order = Order;

  /* ---------- header & footer ---------- */
  const NAV = [
    ["catalogue.html", "Catalogue", "catalogue"],
    ["contact.html#quote", "Custom printing", "printing"],
    ["about.html", "About", "about"],
    ["contact.html", "Contact", "contact"],
  ];

  function header(page) {
    const h = $("#site-header");
    if (!h) return;
    h.innerHTML = `
      <div class="strip"><div class="wrap">
        <div class="strip-delivery"><span>Karachi delivery ${esc(B.delivery.karachi)}</span><span>Rest of Pakistan ${esc(B.delivery.outside)}</span></div>
        <div><a href="https://wa.me/${B.whatsapp}">WhatsApp ${esc(B.phoneDisplay)}</a></div>
      </div></div>
      <div class="site-header"><div class="wrap">
        <a class="wordmark" href="index.html"><b>${esc(B.name)}</b><small>${esc(B.descriptor)}</small></a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
        <nav class="nav" id="nav" aria-label="Main">
          ${NAV.map(([href, label, key]) => `<a href="${href}"${key === (page === "product" ? "catalogue" : page) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="order-link" href="order.html"${page === "order" ? ' aria-current="page"' : ""}>Order list <span class="order-count" data-n="0">0</span></a>
        </nav>
      </div></div>`;
    const btn = $(".menu-btn", h), nav = $("#nav", h);
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "Close" : "Menu";
    });
    updateCount();
    document.addEventListener("order:change", updateCount);
  }
  function updateCount() {
    const n = Order.count();
    $$(".order-count").forEach((el) => { el.textContent = n; el.dataset.n = n; });
  }

  function footer() {
    const f = $("#site-footer");
    if (!f) return;
    f.className = "site-footer";
    f.innerHTML = `<div class="wrap">
      <div class="foot-grid">
        <div>
          <p class="foot-big">${esc(B.name)}</p>
          <p class="muted" style="max-width:26em;margin:0">Boxes, bags, bottles, stickers and packing supplies for shops, kitchens and online sellers. Stock items ship from Karachi.</p>
        </div>
        <div><h4>Catalogue</h4><ul>${WT.categories.slice(0, 5).map((c) => `<li><a href="catalogue.html?cat=${c.id}">${esc(c.short)}</a></li>`).join("")}</ul></div>
        <div><h4>&nbsp;</h4><ul>${WT.categories.slice(5).map((c) => `<li><a href="catalogue.html?cat=${c.id}">${esc(c.short)}</a></li>`).join("")}<li><a href="contact.html#quote">Custom printing</a></li></ul></div>
        <div><h4>Contact</h4><ul>
          <li><a href="https://wa.me/${B.whatsapp}">WhatsApp ${esc(B.phoneDisplay)}</a></li>
          <li><a href="mailto:${B.email}">${esc(B.email)}</a></li>
          <li>${B.addressLines.map(esc).join("<br>")}</li>
          <li class="muted">${esc(B.hours)}</li>
        </ul></div>
      </div>
      <div class="foot-legal"><span>© ${new Date().getFullYear()} ${esc(B.name)}</span><span>Prices in PKR. Confirmed on WhatsApp before dispatch.</span></div>
    </div>`;
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(html) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = html; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 4200);
  }

  /* ---------- product tile ---------- */
  function tile(p) {
    const lo = p.breaks[p.breaks.length - 1];
    const size = sizeText(p);
    const specBits = [size, p.material.split(",")[0]].filter(Boolean).join(" · ");
    return `<article class="item">
      <a href="product.html?id=${p.id}">
        <div class="item-fig">${WT.draw(p)}</div>
        <h3>${esc(p.name)}</h3>
      </a>
      <p class="spec">${esc(specBits)}</p>
      <p class="price"><b>${rs(p.breaks[0][1])} / ${p.unit || "pc"}</b><span>${rs(lo[1])} at ${qtyFmt(lo[0])}+</span></p>
      <button class="add" type="button" data-add="${p.id}">Add ${qtyFmt(moq(p))} to order</button>
    </article>`;
  }
  function bindAdds(root) {
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-add]");
      if (!b) return;
      const p = byId(b.dataset.add);
      Order.add(p.id, moq(p));
      b.classList.add("done");
      b.textContent = "Added — add more?";
      toast(`${esc(p.name)} × ${qtyFmt(moq(p))} added. <a href="order.html">View order list</a>`);
    });
  }

  /* ================= pages ================= */
  const pages = {};

  pages.home = function () {
    const fig = $("#hero-fig");
    if (fig) {
      fig.insertAdjacentHTML("afterbegin", WT.drawHero());
      fig.querySelector("svg").setAttribute("preserveAspectRatio", "xMidYMax meet");
    }

    const idx = $("#cat-index");
    if (idx) {
      idx.innerHTML = WT.categories.map((c, i) => {
        const items = WT.products.filter((p) => p.cat === c.id);
        const from = Math.min(...items.map((p) => p.breaks[p.breaks.length - 1][1]));
        const rep = items.find((p) => p.popular) || items[0];
        return `<a class="cat-row" href="catalogue.html?cat=${c.id}">
          <span class="cat-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="cat-thumb">${WT.draw(rep, { pad: 0.04 })}</span>
          <span class="cat-name">${esc(c.name)}</span>
          <span class="cat-blurb">${esc(c.blurb)}</span>
          <span class="cat-from">${items.length} items<b>from ${rs(from)}</b></span>
          <span class="cat-arrow" aria-hidden="true">→</span>
        </a>`;
      }).join("");
    }

    const pop = $("#popular");
    if (pop) {
      pop.innerHTML = WT.products.filter((p) => p.popular).slice(0, 8).map(tile).join("");
      bindAdds(pop);
    }

    const ex = $("#breaks-example");
    if (ex) ex.innerHTML = breaksTable(byId("pizza-12"), 500, true);

    renderCustomers($("#customers"));
    renderTerms($("#terms"));
  };

  function renderCustomers(el) {
    if (!el) return;
    el.innerHTML = WT.customers.map((c) => `<li>${esc(c.name)}<small>${esc(c.type)}, ${esc(c.city)}</small></li>`).join("");
  }

  function renderTerms(el) {
    if (!el) return;
    el.innerHTML = `
      <div><h3>Delivery in Karachi</h3><p class="big">${esc(B.delivery.karachi)}</p><p>${esc(B.delivery.karachiFee)}. Same-day pickup from our warehouse if you call ahead.</p></div>
      <div><h3>Rest of Pakistan</h3><p class="big">${esc(B.delivery.outside)}</p><p>${esc(B.delivery.outsideFee)}. We send the tracking number on WhatsApp.</p></div>
      <div><h3>Payment</h3><p>${esc(B.payment)}</p></div>`;
  }

  function breaksTable(p, currentQty, withCaption) {
    const base = p.breaks[0][1];
    const rows = p.breaks.map(([min, pr], i) => {
      const next = p.breaks[i + 1];
      const range = next ? `${qtyFmt(min)} – ${qtyFmt(next[0] - 1)}` : `${qtyFmt(min)} +`;
      const cur = currentQty >= min && (!next || currentQty < next[0]);
      const save = i === 0 ? "—" : `−${Math.round((1 - pr / base) * 100)}%`;
      return `<tr${cur ? ' class="current"' : ""}><td>${range} ${unitLabel(p, 2)}</td><td class="num">${rs(pr)}</td><td class="num save">${save}</td></tr>`;
    }).join("");
    return `<table class="breaks">${withCaption ? `<caption>${esc(p.name)}, ${esc(p.material.split(",")[0])}</caption>` : ""}
      <thead><tr><th>Quantity</th><th class="num">Each</th><th class="num">Saving</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  /* ---------- catalogue ---------- */
  pages.catalogue = function () {
    const params = new URLSearchParams(location.search);
    const state = { cat: params.get("cat") || "", q: params.get("q") || "", sort: params.get("sort") || "" };
    if (state.cat && !catById(state.cat)) state.cat = "";

    const side = $("#cat-side"), out = $("#results"), qIn = $("#q"), sortIn = $("#sort"), count = $("#result-count"), title = $("#cat-title"), lede = $("#cat-lede");
    qIn.value = state.q; sortIn.value = state.sort;

    function sync() {
      const sp = new URLSearchParams();
      if (state.cat) sp.set("cat", state.cat);
      if (state.q) sp.set("q", state.q);
      if (state.sort) sp.set("sort", state.sort);
      history.replaceState(null, "", location.pathname + (sp.toString() ? "?" + sp : ""));
    }

    function render() {
      side.innerHTML = [{ id: "", short: "Everything" }].concat(WT.categories).map((c) => {
        const n = c.id ? WT.products.filter((p) => p.cat === c.id).length : WT.products.length;
        return `<li><a href="?cat=${c.id}" data-cat="${c.id}" aria-current="${c.id === state.cat}"><span class="lab">${esc(c.short)}</span><span>${n}</span></a></li>`;
      }).join("");

      const cat = catById(state.cat);
      title.textContent = cat ? cat.name : "Catalogue";
      lede.textContent = cat ? cat.blurb : "Everything we keep in stock, with prices at each quantity. Add what you need to the order list and send it to us on WhatsApp — we confirm stock and delivery the same day.";
      document.title = (cat ? cat.name : "Catalogue") + " — " + B.name;

      const q = state.q.trim().toLowerCase();
      let list = WT.products.filter((p) => (!state.cat || p.cat === state.cat) &&
        (!q || (p.name + " " + p.material + " " + catById(p.cat).name).toLowerCase().includes(q)));
      if (state.sort === "low") list = list.slice().sort((a, b) => a.breaks[0][1] - b.breaks[0][1]);
      if (state.sort === "high") list = list.slice().sort((a, b) => b.breaks[0][1] - a.breaks[0][1]);

      count.textContent = `${list.length} ${list.length === 1 ? "item" : "items"}${q ? ` matching “${state.q.trim()}”` : ""}`;

      if (!list.length) {
        out.innerHTML = `<div class="empty"><h3>Nothing matches “${esc(state.q.trim())}”.</h3>
          <p>We may still be able to get it — a lot of what we sell is made to order. Send us the size and quantity and we'll tell you the price.</p>
          <p style="display:flex;gap:20px;flex-wrap:wrap;align-items:center;margin-top:20px">
            <a class="btn" href="https://wa.me/${B.whatsapp}?text=${encodeURIComponent("Hi, do you have: " + state.q.trim())}">Ask on WhatsApp</a>
            <a class="arrow-link" href="#" data-clear>Clear search</a></p></div>`;
        return;
      }
      if (!state.cat && !q && !state.sort) {
        // grouped by category when browsing everything
        out.innerHTML = WT.categories.map((c) => {
          const items = list.filter((p) => p.cat === c.id);
          if (!items.length) return "";
          return `<section class="cat-group" id="${c.id}"><div class="cat-group-head"><h2>${esc(c.name)}</h2><p>${esc(c.blurb)}</p></div>
            <div class="grid three">${items.map(tile).join("")}</div></section>`;
        }).join("");
      } else {
        out.innerHTML = `<div class="grid three">${list.map(tile).join("")}</div>`;
      }
    }

    side.addEventListener("click", (e) => {
      const a = e.target.closest("[data-cat]");
      if (!a) return;
      e.preventDefault();
      state.cat = a.dataset.cat;
      sync(); render();
      window.scrollTo({ top: 0 });
    });
    out.addEventListener("click", (e) => {
      if (e.target.closest("[data-clear]")) { e.preventDefault(); state.q = ""; qIn.value = ""; sync(); render(); qIn.focus(); }
    });
    let deb;
    qIn.addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(() => { state.q = qIn.value; sync(); render(); }, 120); });
    sortIn.addEventListener("change", () => { state.sort = sortIn.value; sync(); render(); });
    bindAdds(out);
    render();
  };

  /* ---------- product ---------- */
  pages.product = function () {
    const id = new URLSearchParams(location.search).get("id");
    const p = byId(id);
    const root = $("#product");
    if (!p) {
      root.innerHTML = `<div class="wrap"><div class="empty" style="border:0;padding:72px 0">
        <h3>We couldn't find that item.</h3>
        <p>The link may be old, or the item may have been renamed. The catalogue has everything currently in stock.</p>
        <p style="margin-top:20px"><a class="btn" href="catalogue.html">Go to the catalogue</a></p></div></div>`;
      document.title = "Item not found — " + B.name;
      return;
    }
    const cat = catById(p.cat);
    document.title = p.name + " — " + B.name;
    const size = sizeText(p);
    const specs = [
      size && ["Size", size + (p.dims.length === 3 ? " (W × D × H, outer)" : "")],
      ["Material", p.material],
      ["Sold per", { pc: "piece", kg: "kilogram" }[p.unit || "pc"] || p.unit],
      ["Minimum", `${qtyFmt(moq(p))} ${unitLabel(p, moq(p))}`],
      p.printable && ["Printing", "Available with your logo — " + (p.needsArtwork ? "artwork required, 100% advance" : "from 500 pcs, 7–10 working days")],
      ["Category", `<a href="catalogue.html?cat=${cat.id}">${esc(cat.name)}</a>`],
    ].filter(Boolean);

    const inOrder = Order.read()[p.id] || 0;
    root.innerHTML = `<div class="wrap"><div class="product">
      <figure class="product-fig" style="margin-top:0;margin-bottom:0">${WT.draw(p, { dims: true, pad: 0.1 })}
        <figcaption>Drawing to scale from the listed size. Photos of the actual stock on request.</figcaption></figure>
      <div class="product-info">
        <p class="crumbs"><a href="catalogue.html">Catalogue</a> / <a href="catalogue.html?cat=${cat.id}">${esc(cat.short)}</a></p>
        <h1>${esc(p.name).replace(/ × /g, "&nbsp;×&nbsp;")}</h1>
        <dl class="spec-list">${specs.map(([k, v]) => `<dt>${k}</dt><dd>${k === "Category" ? v : esc(v)}</dd>`).join("")}</dl>
        <div id="breaks"></div>
        <div class="buy">
          <div class="buy-row">
            <div class="qty"><label for="qty">Quantity (${unitLabel(p, 2)})</label>
              <div class="qty-box"><button type="button" data-step="-1" aria-label="Less">−</button><input id="qty" type="number" inputmode="numeric" min="${moq(p)}" value="${Math.max(inOrder, moq(p))}"><button type="button" data-step="1" aria-label="More">+</button></div>
            </div>
            <button class="btn" type="button" id="add">${inOrder ? "Update order list" : "Add to order list"}</button>
          </div>
          <p class="buy-total" id="total"></p>
          <p class="buy-hint" id="hint"></p>
          <p class="buy-err" id="err" hidden></p>
          <p class="buy-note">Nothing is charged online. You send the list on WhatsApp, we confirm stock and the delivery charge, then you pay.</p>
        </div>
      </div></div></div>`;

    const qty = $("#qty"), total = $("#total"), hint = $("#hint"), err = $("#err"), add = $("#add");
    const steps = p.breaks.map((b) => b[0]);
    function upd() {
      const q = parseInt(qty.value, 10);
      if (!q || q < moq(p)) {
        err.hidden = false; err.textContent = `Minimum order is ${qtyFmt(moq(p))} ${unitLabel(p, moq(p))}.`;
        total.innerHTML = ""; hint.textContent = ""; add.disabled = true;
        $("#breaks").innerHTML = breaksTable(p, 0);
        return;
      }
      err.hidden = true; add.disabled = false;
      const u = unitPrice(p, q);
      total.innerHTML = `${qtyFmt(q)} × ${rs(u)} = <b>${rs(u * q)}</b>`;
      const nb = p.breaks.find((b) => b[0] > q);
      hint.textContent = nb ? `Order ${qtyFmt(nb[0])} and the price drops to ${rs(nb[1])} each.` : "You're on our lowest price for this item.";
      $("#breaks").innerHTML = breaksTable(p, q);
    }
    root.addEventListener("click", (e) => {
      const s = e.target.closest("[data-step]");
      if (!s) return;
      const q = parseInt(qty.value, 10) || moq(p);
      const dir = +s.dataset.step;
      // step between price breaks for quick jumps; otherwise by the minimum
      let nq;
      if (dir > 0) nq = steps.find((x) => x > q) || q + moq(p);
      else nq = [...steps].reverse().find((x) => x < q) || moq(p);
      qty.value = Math.max(moq(p), nq);
      upd();
    });
    qty.addEventListener("input", upd);
    add.addEventListener("click", () => {
      const q = parseInt(qty.value, 10);
      if (!q || q < moq(p)) return;
      Order.set(p.id, q);
      add.textContent = "Update order list";
      toast(`Order list now has ${qtyFmt(q)} × ${esc(p.name)}. <a href="order.html">View order list</a>`);
    });
    upd();

    const rel = WT.products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    if (rel.length) {
      const r = $("#related");
      r.innerHTML = `<div class="wrap"><div class="sec-head"><h2>More ${esc(cat.short.toLowerCase())}</h2></div><div class="grid">${rel.map(tile).join("")}</div></div>`;
      bindAdds(r);
    }
  };

  /* ---------- order list ---------- */
  pages.order = function () {
    const tableWrap = $("#order-table"), form = $("#order-form");

    function render() {
      const lines = Order.lines();
      if (!lines.length) {
        tableWrap.innerHTML = `<div class="empty"><h3>Your order list is empty.</h3>
          <p>Add items from the catalogue, then come back here to send the list to us on WhatsApp. Or just message us what you need — plenty of customers do.</p>
          <p style="display:flex;gap:20px;flex-wrap:wrap;align-items:center;margin-top:20px"><a class="btn" href="catalogue.html">Browse the catalogue</a>
          <a class="arrow-link" href="https://wa.me/${B.whatsapp}">Message us instead</a></p></div>`;
        form.hidden = true;
        return;
      }
      form.hidden = false;
      let sum = 0;
      const rows = lines.map(({ p, q }) => {
        const u = unitPrice(p, q); sum += u * q;
        const bad = q < moq(p);
        return `<tr data-id="${p.id}">
          <td class="fig">${WT.draw(p, { pad: 0.04 })}</td>
          <td class="name"><a href="product.html?id=${p.id}">${esc(p.name)}</a><span class="mono">${esc(sizeText(p) || p.material.split(",")[0])}</span></td>
          <td><label class="visually-hidden" for="q-${p.id}">Quantity of ${esc(p.name)}</label><input id="q-${p.id}" type="number" inputmode="numeric" min="${moq(p)}" value="${q}">
            ${bad ? `<span class="row-err">Minimum ${qtyFmt(moq(p))}</span>` : ""}</td>
          <td class="num unit">${rs(u)}</td>
          <td class="num">${rs(u * q)}</td>
          <td><button class="remove" type="button" data-remove>Remove</button></td>
        </tr>`;
      }).join("");
      tableWrap.innerHTML = `<table class="order">
        <thead><tr><th></th><th>Item</th><th>Qty</th><th class="num">Each</th><th class="num">Amount</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td></td><td colspan="3">Items total, before delivery</td><td class="num total">${rs(sum)}</td><td></td></tr></tfoot>
      </table>
      <p class="form-note" style="margin-top:16px">Prices are for stock items in plain kraft or white. Printed versions are quoted separately.</p>`;
    }

    tableWrap.addEventListener("change", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr || e.target.tagName !== "INPUT") return;
      const v = parseInt(e.target.value, 10);
      Order.set(tr.dataset.id, isNaN(v) ? 0 : v);
      render();
    });
    tableWrap.addEventListener("click", (e) => {
      if (!e.target.closest("[data-remove]")) return;
      const tr = e.target.closest("tr[data-id]");
      const p = byId(tr.dataset.id), q = Order.read()[p.id];
      Order.set(p.id, 0); render();
      toast(`Removed ${esc(p.name)}. <a href="#" id="undo">Undo</a>`);
      $("#undo").addEventListener("click", (ev) => { ev.preventDefault(); Order.set(p.id, q); render(); $("#toast").hidden = true; });
    });

    function message(v) {
      const lines = Order.lines();
      let sum = 0;
      const items = lines.map(({ p, q }, i) => {
        const u = unitPrice(p, q); sum += u * q;
        return `${i + 1}. ${p.name} — ${qtyFmt(q)} ${unitLabel(p, q)} × ${rs(u)} = ${rs(u * q)}`;
      });
      return [
        `Order for ${B.name}`, "",
        ...items, "", `Items total: ${rs(sum)}`, "",
        `Name: ${v.name}`, v.business ? `Business: ${v.business}` : null, `Phone: ${v.phone}`, `City: ${v.city}`, v.address ? `Address: ${v.address}` : null,
        v.notes ? `Notes: ${v.notes}` : null,
      ].filter((x) => x !== null).join("\n");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(form).entries());
      if (!validate(form, v)) return;
      const bad = Order.lines().filter(({ p, q }) => q < moq(p));
      if (bad.length) { $("#order-status").textContent = `${bad[0].p.name} is below its minimum order. Change the quantity before sending.`; return; }
      window.open(`https://wa.me/${B.whatsapp}?text=${encodeURIComponent(message(v))}`, "_blank", "noopener");
      $("#order-status").className = "status ok";
      $("#order-status").textContent = "WhatsApp opened with your order. Press send there — we usually reply within the hour during working hours.";
    });
    $("#copy-order").addEventListener("click", async () => {
      const v = Object.fromEntries(new FormData(form).entries());
      const st = $("#order-status");
      try { await navigator.clipboard.writeText(message(v)); st.className = "status ok"; st.textContent = "Order copied. Paste it into an email or message."; }
      catch (err) { st.className = "status"; st.textContent = "Couldn't copy automatically — select the text in WhatsApp instead."; }
    });

    document.addEventListener("order:change", () => {});
    render();
  };

  /* ---------- form validation (shared) ---------- */
  function validate(form, v) {
    let first = null;
    $$("[data-required]", form).forEach((fld) => {
      const input = $("input,select,textarea", fld);
      let ok = String(v[input.name] || "").trim().length > 0;
      if (ok && input.name === "phone") ok = String(v.phone).replace(/\D/g, "").length >= 10;
      if (ok) fld.removeAttribute("data-invalid");
      else { fld.setAttribute("data-invalid", ""); input.setAttribute("aria-invalid", "true"); first = first || input; }
      if (ok) input.removeAttribute("aria-invalid");
    });
    if (first) first.focus();
    return !first;
  }

  /* ---------- contact / quote ---------- */
  pages.contact = function () {
    const form = $("#quote-form");
    const sel = $("#q-product");
    sel.innerHTML = `<option value="">Choose one…</option>` +
      WT.categories.map((c) => `<optgroup label="${esc(c.name)}">${WT.products.filter((p) => p.cat === c.id && p.printable).map((p) => `<option>${esc(p.name)}</option>`).join("")}</optgroup>`).join("") +
      `<option>Something else (describe below)</option>`;
    $("#contact-list").innerHTML = `
      <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${B.whatsapp}">${esc(B.phoneDisplay)}</a></dd></div>
      <div><dt>Phone</dt><dd><a href="tel:+${B.whatsapp}">${esc(B.phoneDisplay)}</a></dd></div>
      <div><dt>Email</dt><dd><a href="mailto:${B.email}">${esc(B.email)}</a></dd></div>
      <div><dt>Warehouse</dt><dd>${B.addressLines.map(esc).join("<br>")}<br><a href="${B.mapUrl}">Open in Google Maps</a></dd></div>
      <div><dt>Hours</dt><dd>${esc(B.hours)}</dd></div>`;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(form).entries());
      if (!validate(form, v)) return;
      const msg = [
        "Printing quote request", "",
        `Item: ${v.product}`, v.size ? `Size: ${v.size}` : null, `Quantity: ${v.qty}`, `Print: ${v.colours}`, `Artwork ready: ${v.artwork}`,
        v.notes ? `Notes: ${v.notes}` : null, "",
        `Name: ${v.name}`, v.business ? `Business: ${v.business}` : null, `Phone: ${v.phone}`,
      ].filter((x) => x !== null).join("\n");
      window.open(`https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      const st = $("#quote-status");
      st.className = "status ok";
      st.textContent = "WhatsApp opened with your request. Attach your logo there if you have it.";
    });
  };

  pages.about = function () { renderCustomers($("#customers")); renderTerms($("#terms")); };

  /* ---------- boot ---------- */
  const page = document.body.dataset.page;
  header(page);
  footer();
  if (pages[page]) pages[page]();
})();

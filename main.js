(function () {
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Nilai turunan
  var yr = parseInt(S.since, 10);
  S.years = yr ? String(new Date().getFullYear() - yr) : "";

  // Isi elemen data-site
  $$("[data-site]").forEach(function (el) {
    var v = S[el.getAttribute("data-site")];
    if (v) el.textContent = v;
  });

  // Link WhatsApp, telepon, email, Instagram
  var wa = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(S.waMessage || "");
  $$("[data-wa]").forEach(function (a) {
    var extra = a.getAttribute("data-wa");
    a.href = extra ? wa + encodeURIComponent(" " + extra) : wa;
  });
  $$("[data-tel]").forEach(function (a) { a.href = "tel:+" + S.whatsapp; });
  $$("[data-mail]").forEach(function (a) { a.href = "mailto:" + S.email; });
  $$("[data-ig]").forEach(function (a) { a.href = S.instagram; });

  // Link Google Maps
  var q = S.mapsQuery || (S.name + " " + S.address);
  var pid = S.googlePlaceId;
  var mapsUrl = S.googleMapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q) + (pid ? "&query_place_id=" + encodeURIComponent(pid) : ""));
  var reviewsUrl = pid ? "https://search.google.com/local/reviews?placeid=" + encodeURIComponent(pid) : mapsUrl;
  var writeUrl = pid ? "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(pid) : mapsUrl;
  var dirUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q) + (pid ? "&destination_place_id=" + encodeURIComponent(pid) : "");
  $$("[data-gmaps]").forEach(function (a) { a.href = mapsUrl; });
  $$("[data-greviews]").forEach(function (a) { a.href = reviewsUrl; });
  $$("[data-gwrite]").forEach(function (a) { a.href = writeUrl; });
  $$("[data-gdir]").forEach(function (a) { a.href = dirUrl; });
  var frame = $("#mapFrame");
  if (frame) frame.src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";

  $("#year").textContent = new Date().getFullYear();

  // Mode terang / gelap
  var root = document.documentElement, tbtn = $("#themeBtn"), meta = $('meta[name="theme-color"]');
  function applyTheme(t, save) {
    root.setAttribute("data-theme", t);
    tbtn.setAttribute("aria-pressed", t === "dark");
    tbtn.setAttribute("aria-label", t === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap");
    if (meta) meta.setAttribute("content", t === "dark" ? "#0A1A22" : "#0B2F3F");
    if (save) { try { localStorage.setItem("theme", t); } catch (e) {} }
  }
  applyTheme(root.getAttribute("data-theme") || "light", false);
  tbtn.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });
  // Jika pengunjung belum memilih, ikuti perubahan pengaturan perangkat
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var onSys = function (e) {
    var saved = null; try { saved = localStorage.getItem("theme"); } catch (x) {}
    if (!saved) applyTheme(e.matches ? "dark" : "light", false);
  };
  if (mq.addEventListener) mq.addEventListener("change", onSys);

  // Menu mobile
  var btn = $("#menuBtn"), nav = $("#nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  $$("a", nav).forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
  });

  // Lightbox untuk galeri (hanya foto yang sudah terisi)
  var lb = $("#lb"), lbImg = $("#lbImg");
  $$(".gallery .ph").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var img = $("img", fig);
      if (!img || !lb.showModal) return;
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.showModal();
    });
  });
  $("#lbClose").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  // Ulasan dari Google Maps (lewat /api/reviews, opsional)
  function stars(n) { var s = ""; for (var i = 1; i <= 5; i++) s += i <= Math.round(n) ? "★" : "☆"; return s; }
  if (location.protocol.indexOf("http") === 0) {
    fetch("/api/reviews").then(function (r) { return r.status === 200 ? r.json() : null; }).then(function (d) {
      if (!d) return;
      if (d.rating) {
        $$("[data-grating]").forEach(function (el) { el.textContent = String(d.rating).replace(".", ","); });
        $$("[data-gstars]").forEach(function (el) { el.textContent = stars(d.rating); });
        $$("[data-gcount]").forEach(function (el) { el.textContent = d.count; });
        $$(".has-rating").forEach(function (el) { el.hidden = false; });
      }
      var list = $("#reviewList");
      if (list && d.reviews && d.reviews.length) {
        d.reviews.filter(function (v) { return v.text; }).slice(0, 6).forEach(function (v) {
          var f = document.createElement("figure"); f.className = "rev";
          var s = document.createElement("p"); s.className = "rev-stars"; s.textContent = stars(v.rating);
          var b = document.createElement("blockquote"); b.textContent = v.text.length > 320 ? v.text.slice(0, 320).trim() + "…" : v.text;
          var c = document.createElement("figcaption"); c.textContent = v.author + (v.time ? " · " + v.time : "");
          f.appendChild(s); f.appendChild(b); f.appendChild(c);
          list.appendChild(f);
        });
        if (list.children.length) { list.hidden = false; var e = $("#reviewEmpty"); if (e) e.hidden = true; }
      }
    }).catch(function () {});
  }

  // Satu momen animasi: suhu turun 32° -> 18°
  var temp = $("#temp"), bar = $("#tempBar");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (temp) {
    if (reduce) { temp.textContent = "18"; bar.style.setProperty("--p", "1"); return; }
    var start = 32, end = 18, dur = 2600, t0 = null;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      temp.textContent = Math.round(start + (end - start) * e);
      bar.style.setProperty("--p", e.toFixed(3));
      if (p < 1) requestAnimationFrame(step);
    };
    setTimeout(function () { requestAnimationFrame(step); }, 500);
  }
})();

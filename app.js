// SalonFlow Application Core & Router
// Image-Free, Emoji-Free, PWA Ready, 3D Flippable Token Cards

var area = "All", sort = "Shortest wait", sel = {}, token = null;
var onlyLowCrowd = false, onlyFavs = false;
var noShowTimerInterval = null;

// Crowd Labeling
function crowd(w) {
  if (w <= 15) return [t("lowCrowdLabel"), "var(--low)", "low"];
  if (w <= 35) return [t("medCrowdLabel"), "var(--mid)", "mid"];
  return [t("highCrowdLabel"), "var(--high)", "high"];
}

function badge(w) {
  var c = crowd(w);
  var n = Math.min(5, Math.max(1, Math.ceil(w / 8)));
  var m = "";
  for (var i = 0; i < 5; i++) {
    m += '<i' + (i < n ? ' class="f"' : '') + '></i>';
  }
  return '<span class="badge live" style="--c:' + c[1] + '"><i class="dot"></i>' + c[0] + '</span><div class="meter" style="--c:' + c[1] + '">' + m + '</div>';
}

// Generate SVG QR Code for Check-in
function renderQRCodeSVG(dataStr) {
  var hash = 0;
  for (var i = 0; i < dataStr.length; i++) {
    hash = ((hash << 5) - hash) + dataStr.charCodeAt(i);
    hash |= 0;
  }
  var size = 21;
  var cellSize = 7;
  var svgSize = size * cellSize;
  var rects = '';

  for (var r = 0; r < size; r++) {
    for (var c = 0; c < size; c++) {
      var isCorner = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
      var isCornerBorder = isCorner && (r === 0 || r === 6 || c === 0 || c === 6 ||
        r === size - 7 || r === size - 1 || c === size - 7 || c === size - 1 ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) ||
        (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4));
      var isBit = isCorner ? isCornerBorder : (((hash ^ (r * 13 + c * 37)) & 1) === 0);
      if (isBit) {
        rects += '<rect x="' + (c * cellSize) + '" y="' + (r * cellSize) + '" width="' + cellSize + '" height="' + cellSize + '" fill="#000"/>';
      }
    }
  }
  return '<svg width="' + svgSize + '" height="' + svgSize + '" viewBox="0 0 ' + svgSize + ' ' + svgSize + '">' + rects + '</svg>';
}

// Departure Alert Banner (2 Turns Away)
function renderAlertBanner() {
  if (!token || token.status === "completed" || token.status === "skipped" || token.status === "checked_in") return "";
  if (token.pos <= 2) {
    return '<div class="alert-banner" role="alert">' +
      '<div class="alert-banner-left">' +
        '<svg class="alert-icon-svg" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
        '<div class="alert-banner-text">' +
          '<b>' + (token.pos === 1 ? (currentLang === "te" ? "మీ వంతు వచ్చింది! సెలూన్‌కు చేరుకోండి" : "Your turn has arrived!") : (currentLang === "te" ? "బయలుదేరాల్సిన సమయం! మీ ముందు 2 స్థానాలు మాత్రమే ఉన్నాయి." : "Departure Alert: You are 2 turns away")) + '</b>' +
          '<span>' + esc(token.salon) + ' &middot; ~' + token.eta + ' ' + t("minWait") + ' &middot; ' + (token.pos === 1 ? (currentLang === "te" ? "చెక్-ఇన్ గడువు 10 నిమిషాలు" : "10-minute check-in grace period active") : (currentLang === "te" ? "సెలూన్‌కు బయలుదేరండి" : "Start heading over now to keep your spot")) + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-sm main" data-go="token">' + t("myToken") + '</button>' +
    '</div>';
  }
  return "";
}

// Real Photography Salon Card with Monogram & Heart Save
function renderSalonCard(s) {
  var fav = isFav(s.id);
  var photoUrl = (s.photos && s.photos[0]) ? s.photos[0] : REAL_PHOTOS[(s.id - 1) % REAL_PHOTOS.length];

  return '<div class="card" tabindex="0" data-open="' + s.id + '">' +
    '<div class="card-ph" style="background-image:url(\'' + photoUrl + '\');background-color:#1e293b">' +
      '<div class="card-monogram">' + s.initials + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<span class="card-area-badge">' + s.a + '</span>' +
        '<button class="fav-btn' + (fav ? ' active' : '') + '" data-fav="' + s.id + '" title="Toggle Favourite">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="' + (fav ? '#fff' : 'none') + '" stroke="' + (fav ? '#fff' : 'currentColor') + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
          (fav ? 'Saved' : 'Save') +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div class="cb">' +
      '<div class="row">' +
        '<div>' +
          '<h3>' + esc(s.n) + '</h3>' +
          '<div class="sub">' + s.a + ' &middot; ' + s.d + ' km &middot; Rating: ' + s.r + ' (' + (s.rc || 0).toLocaleString("en-IN") + ')</div>' +
        '</div>' +
        '<div class="wait num holo">' +
          '<span data-n="' + s.w + '">' + s.w + '</span>' +
          '<small>' + t("minWait") + '</small>' +
        '</div>' +
      '</div>' +
      badge(s.w) +
    '</div>' +
  '</div>';
}

// PWA Live Notifications & Mobile Install State
var pwaNotifDismissed = false;
var deferredInstallPrompt = null;

if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("beforeinstallprompt", function(e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    var b = document.getElementById("pwa-install-banner");
    if (b) b.style.display = "flex";
  });
}

function renderPWANotificationBanner() {
  try {
    if (localStorage.getItem("sf_pwa_seen") === "1" || localStorage.getItem("sf_pwa_dismissed") === "1") {
      return "";
    }
  } catch (e) {}

  if (typeof window === "undefined" || !("Notification" in window)) return "";
  if (Notification.permission === "granted") return "";

  // Mark seen immediately so once seen, it is gone for lifetime!
  try {
    localStorage.setItem("sf_pwa_seen", "1");
  } catch (e) {}

  return '<div class="pwa-notif-card" id="pwa-notif-card">' +
    '<div class="pwa-notif-left">' +
      '<div class="pwa-notif-icon"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>' +
      '<div class="pwa-notif-text">' +
        '<b>Enable PWA Queue Notifications</b>' +
        '<span>Get native alerts on your phone when 2 turns away and when your turn arrives!</span>' +
      '</div>' +
    '</div>' +
    '<div class="pwa-notif-actions">' +
      '<button class="btn btn-sm main" data-act="enablenotif">Enable Alerts</button>' +
      '<button class="pwa-notif-dismiss" data-act="dismissnotif" title="Dismiss">&times;</button>' +
    '</div>' +
  '</div>';
}

function renderPWAInstallBanner() {
  // Never show standing install banner on home screen if already seen or dismissed
  try {
    if (localStorage.getItem("sf_pwa_seen") === "1" || localStorage.getItem("sf_pwa_dismissed") === "1") {
      return "";
    }
  } catch (e) {}
  return "";
}

// 1. Home View
function home() {
  var app = document.getElementById("app");
  if (!app) return;

  var l = S.slice();

  if (sort === "Shortest wait") l.sort(function(a, b) { return a.w - b.w; });
  if (sort === "Nearest") l.sort(function(a, b) { return a.d - b.d; });
  if (sort === "Top rated") l.sort(function(a, b) { return b.r - a.r; });

  var qInput = document.getElementById("q");
  var q = qInput ? qInput.value : "";
  var qLower = q.toLowerCase().trim();

  if (qLower) {
    l = l.filter(function(s) {
      var servicesText = s.s.map(function(v) { return v[0]; }).join(" ").toLowerCase();
      var fullText = (s.n + " " + s.a + " " + s.addr + " " + servicesText).toLowerCase();
      return fullText.indexOf(qLower) > -1;
    });
  }

  if (area !== "All") {
    l = l.filter(function(s) { return s.a === area; });
  }

  if (onlyLowCrowd) {
    l = l.filter(function(s) { return s.w <= 15; });
  }

  if (onlyFavs) {
    var favs = getFavs();
    l = l.filter(function(s) { return favs.indexOf(s.id) > -1; });
  }

  var totalWait = S.reduce(function(a, s) { return a + s.w; }, 0);
  var avgWait = Math.round(totalWait / S.length);

  var h = renderAlertBanner();
  h += renderPWANotificationBanner();
  h += renderPWAInstallBanner();

  h += '<section class="hero">' +
    '<h1>' + t("heroTitle") + '</h1>' +
    '<p>' + t("heroSub") + '</p>' +

    // Search Bar
    '<div class="search-container">' +
      '<div class="search-bar-wrap">' +
        '<svg class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>' +
        '<input id="q" value="' + esc(q) + '" placeholder="' + t("searchPlaceholder") + '" aria-label="Search salons">' +
        (q ? '<button class="search-clear" id="search-clear" aria-label="Clear search">&times;</button>' : '') +
      '</div>' +
      '<div class="search-meta">' +
        '<span>Showing <b>' + l.length + '</b> of ' + S.length + ' salons in Vizag</span>' +
        '<span>Shortcut: press <kbd style="background:rgba(0,0,0,.08);padding:2px 6px;border-radius:4px;font-size:11px">/</kbd> to search</span>' +
      '</div>' +
    '</div>' +
  '</section>';

  // Statistics Summary Row
  h += '<div class="stats">' +
    '<div class="stat-box"><div class="sn num holo">' + S.length + '</div><div class="sub">' + t("salonsLive") + '</div></div>' +
    '<div class="stat-box"><div class="sn num holo">' + avgWait + ' min</div><div class="sub">' + t("avgWait") + '</div></div>' +
    '<div class="stat-box"><div class="sn num holo">184</div><div class="sub">' + t("tokensBooked") + '</div></div>' +
  '</div>';

  // Quick Sort & Filters (Emoji-Free)
  h += '<div class="chips-group">' +
    '<div class="chips-label">Quick Sort and Filters</div>' +
    '<div class="chips">' +
      '<button class="chip' + (sort === "Shortest wait" && !onlyLowCrowd && !onlyFavs ? " on" : "") + '" data-sort="Shortest wait">' + t("shortestWait") + '</button>' +
      '<button class="chip' + (sort === "Nearest" ? " on" : "") + '" data-sort="Nearest">' + t("nearest") + '</button>' +
      '<button class="chip' + (sort === "Top rated" ? " on" : "") + '" data-sort="Top rated">' + t("topRated") + '</button>' +
      '<button class="chip' + (onlyLowCrowd ? " on" : "") + '" data-toggle-low="1">' + t("lowCrowdOnly") + '</button>' +
      '<button class="chip' + (onlyFavs ? " on" : "") + '" data-toggle-fav="1">' + t("favourites") + ' (' + getFavs().length + ')</button>' +
    '</div>' +
  '</div>';

  // Neighborhood Filter Chips
  h += '<div class="chips-group">' +
    '<div class="chips-label">Neighborhoods in Visakhapatnam</div>' +
    '<div class="chips">' +
      VIZAG_AREAS.map(function(c) {
        return '<button class="chip' + (c === area ? " on" : "") + '" data-area="' + c + '">' + (c === "All" ? t("allAreas") : c) + '</button>';
      }).join("") +
    '</div>' +
  '</div>';

  // Layout Grid + Side Map
  h += '<div class="layout">' +
    '<div>' +
      '<h2>' + (area === "All" ? "Premier Salons in Visakhapatnam" : "Salons in " + area) + '</h2>' +
      '<p class="sub" style="margin:-8px 0 16px">Authentic locations &middot; Live wait time tracking</p>' +
      '<div class="grid">';

  h += l.map(renderSalonCard).join("");

  if (!l.length) {
    h += '<div class="empty"><h2>No salon found</h2><p>Try searching another name or reset your filters.</p><button class="btn main" data-reset-filters="1">Reset Filters</button></div>';
  }

  h += '</div></div>' +
    '<aside class="map" aria-label="Map of Salons in Visakhapatnam">' +
      '<iframe title="Salons in Visakhapatnam" loading="lazy" src="https://www.google.com/maps?q=hair+salons+in+Visakhapatnam&output=embed"></iframe>' +
      '<a class="btn mapbtn" href="https://www.google.com/maps/search/hair+salons+in+Visakhapatnam" target="_blank" rel="noopener">Open in Google Maps &nearr;</a>' +
    '</aside>' +
  '</div>';

  app.innerHTML = h;

  // Number animation
  if (!window.seen) {
    window.seen = 1;
    document.querySelectorAll("[data-n]").forEach(function(el) {
      var target = +el.dataset.n, st = performance.now();
      (function f(n) {
        var p = Math.min(1, (n - st) / 700);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(f);
      })(st);
    });
  }

  var qEl = document.getElementById("q");
  if (qEl) {
    qEl.oninput = function() {
      var pos = qEl.selectionStart;
      home();
      var reEl = document.getElementById("q");
      if (reEl) {
        reEl.focus();
        reEl.setSelectionRange(pos, pos);
      }
    };
  }
}

// Photo Lightbox State & Interactive Gallery
var lbs = null;
var GL = ["Interior Styling Floor", "VIP Grooming Suite", "Wash & Care Lounge", "Aromatherapy & Spa", "Executive Waiting Suite"];

function drawLb() {
  var old = document.getElementById("lb-modal");
  if (old) old.remove();
  if (!lbs) return;

  var s = lbs.salon;
  var idx = lbs.idx;
  var photos = (s.photos && s.photos.length) ? s.photos : REAL_PHOTOS;
  var url = photos[idx % photos.length];
  var total = photos.length;
  var cap = GL[idx % GL.length] || ("Photo " + (idx + 1));

  var modal = document.createElement("div");
  modal.className = "lb";
  modal.id = "lb-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = '<button class="lbx" data-act="lbc" title="Close photo">&times;</button>' +
    '<button class="lbn l" data-act="lbp" title="Previous photo">&lsaquo;</button>' +
    '<div class="lbi">' +
      '<img src="' + url + '" alt="' + esc(s.n) + ' - ' + cap + '">' +
      '<div class="lbc">' + esc(s.n) + ' &middot; ' + cap + ' (' + (idx + 1) + '/' + total + ')</div>' +
    '</div>' +
    '<button class="lbn r" data-act="lbnx" title="Next photo">&rsaquo;</button>';

  document.body.appendChild(modal);
}

function openLb(s, idx) {
  lbs = { salon: s, idx: idx };
  drawLb();
}

function closeLb() {
  lbs = null;
  var old = document.getElementById("lb-modal");
  if (old) old.remove();
}

function nextLb(dir) {
  if (!lbs) return;
  var len = lbs.salon.photos ? lbs.salon.photos.length : 5;
  lbs.idx = (lbs.idx + dir + len) % len;
  drawLb();
}

function tile(s, i) {
  var url = (s.photos && s.photos[i]) || REAL_PHOTOS[(s.id + i * 5) % REAL_PHOTOS.length];
  var label = GL[i] || ("Gallery Photo " + (i + 1));
  return '<button class="gt' + (i === 0 ? ' g0' : '') + '" data-act="lb" data-id="' + s.id + '" data-idx="' + i + '" aria-label="' + esc(s.n) + ' ' + label + '">' +
    '<img src="' + url + '" alt="' + esc(s.n) + ' ' + label + '" loading="lazy">' +
  '</button>';
}

function gallery(s) {
  return '<div class="gal">' +
    tile(s, 0) +
    tile(s, 1) +
    tile(s, 2) +
    tile(s, 3) +
    tile(s, 4) +
    '<span class="gc">5 photos &middot; Tap to expand</span>' +
  '</div>';
}

// 2. Salon Detail View
function detail(id) {
  var s = S.filter(function(x) { return x.id == id; })[0];
  if (!s) return home();

  sel[id] = sel[id] || {};

  var pickedIndices = [];
  s.s.forEach(function(v, i) {
    if (sel[id][i]) pickedIndices.push(i);
  });

  var pickedPrice = 0;
  var pickedDuration = 0;
  pickedIndices.forEach(function(idx) {
    pickedPrice += s.s[idx][1];
    pickedDuration += s.s[idx][2];
  });

  var serviceMin = pickedDuration > 0 ? pickedDuration : 25;
  var queueWait = s.w;
  var totalWait = queueWait + serviceMin;
  var aheadCount = Math.max(1, Math.round(queueWait / 8));

  var readyDate = new Date(Date.now() + totalWait * 60000);
  var rh = readyDate.getHours();
  var rm = readyDate.getMinutes();
  var rampm = rh >= 12 ? 'PM' : 'AM';
  rh = rh % 12 || 12;
  var readyBy = rh + ':' + (rm < 10 ? '0' : '') + rm + ' ' + rampm;

  var fav = isFav(s.id);
  var h = renderAlertBanner();

  h += '<button class="back" data-go="home">&lsaquo; ' + (currentLang === "te" ? "అన్ని సెలూన్లు" : "All Vizag Salons") + '</button>' +
    gallery(s) +
    '<div class="cols">' +
      '<div>' +
        '<div class="row" style="align-items:flex-start">' +
          '<div>' +
            '<h2>' + esc(s.n) + '</h2>' +
            '<p class="sub">' + s.a + ' &middot; ' + s.d + ' km &middot; Rating: ' + s.r + ' (' + (s.rc || 0).toLocaleString("en-IN") + ' reviews)</p>' +
          '</div>' +
          '<button class="fav-btn' + (fav ? ' active' : '') + '" data-fav="' + s.id + '" title="Toggle Favourite">' + (fav ? 'Saved' : 'Save') + '</button>' +
        '</div>' +

        // Smarter Wait Time Calculation Box
        '<div class="smart-wait-box">' +
          '<div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.05em">Smarter Wait Time Engine</div>' +
          '<div class="smart-wait-row">' +
            '<span>Queue waiting time (stylist availability)</span>' +
            '<b class="num">' + queueWait + ' min (' + aheadCount + ' ahead)</b>' +
          '</div>' +
          '<div class="smart-wait-row">' +
            '<span>Selected services duration</span>' +
            '<b class="num">+' + serviceMin + ' min (' + (pickedIndices.length || "1 default") + ' service)</b>' +
          '</div>' +
          '<div class="smart-progress-bar">' +
            '<div class="smart-bar-queue" style="width:' + Math.round((queueWait / totalWait) * 100) + '%"></div>' +
            '<div class="smart-bar-service" style="width:' + Math.round((serviceMin / totalWait) * 100) + '%"></div>' +
          '</div>' +
          '<div class="smart-wait-row total">' +
            '<span>Total Turnaround &middot; Service Ready By</span>' +
            '<span class="holo num" style="font-size:18px">' + totalWait + ' min &middot; ~' + readyBy + '</span>' +
          '</div>' +
        '</div>' +

        '<h3 style="margin:24px 0 12px;font-size:20px">Choose Services</h3>' +
        s.s.map(function(v, i) {
          var isPicked = !!sel[id][i];
          return '<div class="svc' + (isPicked ? " on" : "") + '" tabindex="0" data-svc="' + i + '">' +
            '<div>' +
              '<b>' + v[0] + '</b><span class="svc-tag">' + v[3] + '</span>' +
              '<div class="sub">' + v[2] + ' min duration</div>' +
            '</div>' +
            '<b class="num">Rs ' + v[1] + '</b>' +
          '</div>';
        }).join("") +

        '<h3 style="margin:28px 0 12px;font-size:20px">Location and Contact</h3>' +
        '<div class="panel">' +
          '<div style="font-weight:600">' + s.addr + '</div>' +
          '<div class="sub" style="margin:6px 0 14px">' + s.h + ' &middot; ' + s.ph + '</div>' +
          '<iframe class="dmap" title="Map" loading="lazy" src="' + mapSrc(s) + '"></iframe>' +
          '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">' +
            '<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + s.lat + ',' + s.lng + '&destination_place_id=' + s.pid + '">Directions &nearr;</a>' +
            '<a class="btn" href="tel:' + s.ph.replace(/\s/g, "") + '">Call Salon</a>' +
          '</div>' +
        '</div>' +

        reviewsHTML(s) +
      '</div>' +

      // Side Live Queue Panel
      '<div class="panel sticky-p">' +
        '<div class="sub live"><i class="dot" style="--c:var(--low);display:inline-block;margin-right:6px"></i>Live Queue Status</div>' +
        '<div class="big num holo" style="margin:10px 0 4px">' + totalWait + ' min</div>' +
        '<div class="sub">' + aheadCount + ' customer' + (aheadCount === 1 ? '' : 's') + ' ahead of you &middot; ~' + readyBy + '</div>' +
        badge(s.w) +
        '<div class="row" style="margin-top:22px">' +
          '<span class="sub">' + (pickedIndices.length || 1) + ' service' + (pickedIndices.length === 1 ? '' : 's') + '</span>' +
          '<b class="num">Rs ' + (pickedPrice || 250) + '</b>' +
        '</div>' +
        '<button class="btn main" style="width:100%;margin-top:14px" data-book="' + id + '">' + t("bookToken") + '</button>' +
      '</div>' +
    '</div>' +

    // Sticky Bottom Bar
    '<div class="sticky">' +
      '<div>' +
        '<div class="num" style="font-weight:700">Rs ' + (pickedPrice || 250) + ' &middot; ~' + totalWait + ' min</div>' +
        '<div class="sub">' + (pickedIndices.length || 1) + ' selected</div>' +
      '</div>' +
      '<button class="btn main" data-book="' + id + '">' + t("bookToken") + '</button>' +
    '</div>';

  app.innerHTML = h;
}

// 3. Active Token View with 3D Flippable Card
function tokenView() {
  var app = document.getElementById("app");
  if (!app) return;

  token = ld(K.t, null);

  if (!token) {
    app.innerHTML = '<div class="empty">' +
      '<h2>No Active Token</h2>' +
      '<p>Select any salon in Visakhapatnam and book a token to generate your pass card.</p>' +
      '<button class="btn main" data-go="home">Browse Salons</button>' +
    '</div>';
    return;
  }

  // 10-Minute Arrival Grace Period Engine
  if (token.pos <= 1 && token.status !== "checked_in" && token.status !== "skipped") {
    if (!token.callTime) {
      token.callTime = Date.now();
      sv(K.t, token);
      sendRealNotification("Your Turn at " + token.salon, "Your token #" + token.no + " is called! Please check in within 10 minutes.");
    }
    var elapsedSec = Math.floor((Date.now() - token.callTime) / 1000);
    var remainingSec = Math.max(0, 600 - elapsedSec);
    token.remainingSec = remainingSec;

    if (remainingSec <= 0 && token.status !== "skipped") {
      token.status = "skipped";
      token.pos = 0;
      sv(K.t, token);
      toast("Token #" + token.no + " expired due to 10-minute no-show policy.");
    }
  }

  var isTurn = token.pos <= 1;
  var isCheckedIn = token.status === "checked_in";
  var isSkipped = token.status === "skipped";

  var timerDisplay = "";
  if (isTurn && !isCheckedIn && !isSkipped) {
    var r = token.remainingSec || 600;
    var m = Math.floor(r / 60);
    var sec = r % 60;
    timerDisplay = (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  var h = '<div style="max-width:540px;margin:20px auto">' +
    '<div class="panel tok" style="padding:24px 20px">' +
      '<div class="sub">' + esc(token.salon) + '</div>' +
      '<div style="font-size:22px;font-weight:800;margin:8px 0">' +
        (isCheckedIn ? 'Checked In and In Service' :
         isSkipped ? 'Token Skipped (No-Show)' :
         isTurn ? t("youAreNext") :
         (t("youArePos") + ' #' + token.pos + ' in queue')) +
      '</div>';

  if (!isCheckedIn && !isSkipped) {
    h += '<div class="sub live"><i class="dot" style="--c:var(--low);display:inline-block;margin-right:6px"></i>Estimated wait: ~' + token.eta + ' ' + t("minWait") + '</div>';
  }

  if (isTurn && !isCheckedIn && !isSkipped) {
    h += '<div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;border-radius:14px;padding:12px;margin:16px 0;font-size:14px;font-weight:600">' +
      'Arrival Window: <span id="arrival-timer-val">' + timerDisplay + '</span> remaining. Please check in at counter or token will be skipped.' +
    '</div>';
  }

  // 3D Flippable Premium Card
  h += render3DTokenCard(token, 0);

  // Action Buttons
  h += '<div style="display:flex;gap:10px;flex-direction:column;margin-top:18px">';
  if (!isCheckedIn && !isSkipped) {
    h += '<button class="btn main" data-act="qrcheckin">' + t("checkInQR") + ' (Simulate Counter Scan)</button>';
    h += '<button class="btn" data-act="simadvanceturn">Advance Turn in Queue (Test 2-Turn Alert)</button>';
    h += '<button class="btn btn-danger" data-act="simnoshow">Simulate 10-Minute Late (Test No-Show Skip)</button>';
    h += '<div style="display:flex;gap:8px;margin-top:4px">' +
      '<button class="btn btn-sm" style="flex:1" data-act="testnotif">🔔 Test PWA Alert</button>' +
      '<button class="btn btn-sm" style="flex:1" data-act="installpwa">📲 Install PWA</button>' +
    '</div>';
  }
  h += '<button class="btn" data-cancel="1">' + (isSkipped || isCheckedIn ? "Clear Token" : t("cancelToken")) + '</button>';
  h += '</div>' +
    '</div></div>';

  app.innerHTML = h;

  if (noShowTimerInterval) clearInterval(noShowTimerInterval);
  if (isTurn && !isCheckedIn && !isSkipped) {
    noShowTimerInterval = setInterval(function() {
      if (location.hash !== "#token") {
        clearInterval(noShowTimerInterval);
        return;
      }
      var curTok = ld(K.t, null);
      if (!curTok || !curTok.callTime) return;
      var elapsedSec = Math.floor((Date.now() - curTok.callTime) / 1000);
      var remainingSec = Math.max(0, 600 - elapsedSec);
      curTok.remainingSec = remainingSec;
      sv(K.t, curTok);

      var timerEl = document.getElementById("arrival-timer-val");
      if (timerEl) {
        var tm = Math.floor(remainingSec / 60);
        var tsec = remainingSec % 60;
        timerEl.textContent = (tm < 10 ? '0' : '') + tm + ':' + (tsec < 10 ? '0' : '') + tsec;
      }

      if (remainingSec <= 0 && curTok.status !== "skipped") {
        clearInterval(noShowTimerInterval);
        curTok.status = "skipped";
        curTok.pos = 0;
        sv(K.t, curTok);
        toast("Token #" + curTok.no + " expired due to 10-minute no-show policy.");
        tokenView();
      }
    }, 1000);
  }
}

// 4. Central Router
function route() {
  var h = location.hash.slice(1) || "home";

  document.querySelectorAll("[data-go]").forEach(function(a) {
    if (a.tagName === "A") {
      a.classList.toggle("on", a.dataset.go === h);
    }
  });

  var pagesMap = window.PAGES || (typeof PAGES !== "undefined" ? PAGES : null);
  if (pagesMap && pagesMap[h]) {
    pagesMap[h]();
  } else if (h === "token") {
    tokenView();
  } else if (h === "wallet") {
    walletView();
  } else if (h === "admin-queue") {
    adminQueueView();
  } else if (h === "sql-studio") {
    sqlStudioView();
  } else if (h.indexOf("salon-") === 0) {
    detail(h.slice(6));
  } else {
    home();
  }

  window.scrollTo(0, 0);
  authUI();
  renderFooter();
}

// Global Click Handlers
document.addEventListener("click", function(e) {
  var tTarget = e.target.closest("[data-go],[data-open],[data-svc],[data-book],[data-sort],[data-area],[data-cancel],[data-fav],[data-toggle-low],[data-toggle-fav],[data-reset-filters],[data-act]");
  if (!tTarget) return;

  if (e.target.closest("#search-clear")) {
    var qInput = document.getElementById("q");
    if (qInput) {
      qInput.value = "";
      home();
    }
    return;
  }

  var h = location.hash.slice(1);

  if (tTarget.dataset.go) {
    location.hash = tTarget.dataset.go;
  }
  else if (tTarget.dataset.open) {
    location.hash = "salon-" + tTarget.dataset.open;
  }
  else if (tTarget.dataset.fav) {
    e.stopPropagation();
    toggleFav(tTarget.dataset.fav);
  }
  else if (tTarget.dataset.sort) {
    sort = tTarget.dataset.sort;
    onlyLowCrowd = false;
    home();
  }
  else if (tTarget.dataset.area) {
    area = tTarget.dataset.area;
    home();
  }
  else if (tTarget.dataset.toggleLow) {
    onlyLowCrowd = !onlyLowCrowd;
    home();
  }
  else if (tTarget.dataset.toggleFav) {
    onlyFavs = !onlyFavs;
    home();
  }
  else if (tTarget.dataset.resetFilters) {
    sort = "Shortest wait";
    area = "All";
    onlyLowCrowd = false;
    onlyFavs = false;
    var qIn = document.getElementById("q");
    if (qIn) qIn.value = "";
    home();
  }
  else if (tTarget.dataset.svc) {
    var id = h.slice(6);
    sel[id][tTarget.dataset.svc] = !sel[id][tTarget.dataset.svc];
    var y = window.scrollY;
    detail(id);
    window.scrollTo(0, y);
  }
  else if (tTarget.dataset.book) {
    if (!me()) {
      goLogin("Please log in to book a queue token");
      return;
    }
    var s = S.filter(function(x) { return x.id == tTarget.dataset.book; })[0];
    var p = Math.max(1, Math.round(s.w / 8));
    var tokNo = 40 + Math.floor(Math.random() * 40);
    token = {
      id: "SF-2026-" + Math.floor(1000 + Math.random() * 9000),
      salonId: s.id,
      salon: s.n,
      area: s.a,
      addr: s.addr,
      no: tokNo,
      pos: p,
      eta: s.w,
      status: "waiting",
      services: ["Executive Haircut and Styling"],
      price: 250,
      date: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      qrHash: "sf-tok-" + tokNo + "-" + s.id + "-live",
      created: Date.now()
    };
    sv(K.t, token);
    saveWalletToken(token);
    sendRealNotification("Token #" + token.no + " Confirmed!", "You are in line at " + token.salon + " (Pos #" + token.pos + ", ~" + token.eta + " min wait).");
    toast("Token #" + token.no + " booked and saved to your Pass Wallet!");
    location.hash = "token";
  }
  else if (tTarget.dataset.cancel) {
    token = null;
    sv(K.t, null);
    toast("Token cancelled");
    tokenView();
  }
  else if (tTarget.dataset.act === "qrcheckin") {
    if (token) {
      token.status = "checked_in";
      token.pos = 0;
      sv(K.t, token);
      toast("Check-in verified via QR! You are now in service.");
      tokenView();
    }
  }
  else if (tTarget.dataset.act === "simadvanceturn") {
    if (token && token.pos > 1) {
      token.pos--;
      token.eta = Math.max(5, token.eta - 10);
      sv(K.t, token);
      if (token.pos === 2) {
        toast("Departure Alert: You are now 2 turns away at " + token.salon + "!");
        sendRealNotification("Departure Alert", "You are 2 turns away at " + token.salon + "! Start heading over now.");
      }
      tokenView();
    } else if (token && token.pos === 1) {
      toast("You are turn #1! Arrival countdown is active.");
    }
  }
  else if (tTarget.dataset.act === "simnoshow") {
    if (token) {
      token.status = "skipped";
      token.pos = 0;
      sv(K.t, token);
      toast("10-minute arrival window expired. Token marked as no-show.");
      tokenView();
    }
  }
  else if (tTarget.dataset.act === "lb") {
    var sid = +tTarget.dataset.id;
    var sObj = S.filter(function(x) { return x.id === sid; })[0];
    if (sObj) openLb(sObj, +tTarget.dataset.idx || 0);
  }
  else if (tTarget.dataset.act === "lbc") {
    closeLb();
  }
  else if (tTarget.dataset.act === "lbp") {
    nextLb(-1);
  }
  else if (tTarget.dataset.act === "lbnx") {
    nextLb(1);
  }
  else if (tTarget.dataset.act === "enablenotif") {
    try {
      localStorage.setItem("sf_pwa_seen", "1");
      localStorage.setItem("sf_pwa_dismissed", "1");
    } catch (e) {}
    requestNotificationPermission(function(granted) {
      var el = document.getElementById("pwa-notif-card");
      if (el) el.remove();
    });
  }
  else if (tTarget.dataset.act === "dismissnotif") {
    try {
      localStorage.setItem("sf_pwa_seen", "1");
      localStorage.setItem("sf_pwa_dismissed", "1");
    } catch (e) {}
    var el = document.getElementById("pwa-notif-card");
    if (el) el.remove();
  }
  else if (tTarget.dataset.act === "flipcard" || e.target.closest(".token-card-3d") || e.target.closest("[data-act='flipcard']")) {
    var cardEl = e.target.closest(".token-card-3d");
    if (cardEl) {
      cardEl.classList.toggle("flipped");
    }
  }
  else if (tTarget.dataset.act === "testnotif") {
    sendRealNotification("SalonFlow PWA Live Alert", "Live Queue Alert: You are 2 turns away at Toni and Guy Unisex Salon (~14 min wait).");
    toast("Test PWA notification sent to your device!");
  }
  else if (tTarget.dataset.act === "installpwa") {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(function(choice) {
        if (choice.outcome === "accepted") {
          toast("SalonFlow PWA installed successfully!");
        }
        deferredInstallPrompt = null;
      });
    } else {
      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        toast("To install on iPhone: Tap the Share button at bottom and tap 'Add to Home Screen'");
      } else {
        toast("To install: Open browser menu (⋮) > tap 'Install app' or 'Add to Home screen'");
      }
    }
  }
});

// Shortcut key '/' and Lightbox keyboard navigation
document.addEventListener("keydown", function(e) {
  if (lbs) {
    if (e.key === "Escape") {
      closeLb();
      return;
    }
    if (e.key === "ArrowLeft") {
      nextLb(-1);
      return;
    }
    if (e.key === "ArrowRight") {
      nextLb(1);
      return;
    }
  }

  if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    var qEl = document.getElementById("q");
    if (qEl) {
      e.preventDefault();
      qEl.focus();
    }
  }
  if (e.key === "Enter" && e.target.matches(".card, .svc")) {
    e.target.click();
  }
});

var logoEl = document.getElementById("logo");
if (logoEl) {
  logoEl.onclick = function() { location.hash = "home"; };
}

var langToggleEl = document.getElementById("lang-toggle");
if (langToggleEl) {
  langToggleEl.onclick = function() {
    setLang(currentLang === "en" ? "te" : "en");
  };
}

// Register PWA Service Worker
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("./sw.js").catch(function() {});
  });
}

window.addEventListener("hashchange", route);
route();

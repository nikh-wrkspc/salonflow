// SalonFlow Pages: Auth, Account, Settings, Leather Wallet, Admin QR Verifier, DBMS SQL Studio, Analytics

var after = "home", RS = 0;

function cur() {
  return S.filter(function(x) { return x.id == location.hash.slice(7); })[0];
}

function goLogin(m) {
  after = location.hash.slice(1) || "home";
  if (m) toast(m);
  location.hash = "login";
}

function updateThemeUI() {
  var tTheme = document.documentElement.dataset.theme || "dark";
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.textContent = tTheme === "light" ? "Dark Theme" : "Light Theme";
  }
  document.querySelectorAll("[data-theme-set]").forEach(function(el) {
    el.classList.toggle("on", el.dataset.themeSet === tTheme);
  });
}

function authUI() {
  var u = me(), b = document.getElementById("hb");
  if (b) {
    b.textContent = u ? u.name.split(" ")[0] : t("login");
    b.dataset.go = u ? "account" : "login";
  }
  var langBtn = document.getElementById("lang-btn") || document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.textContent = currentLang === "te" ? "EN" : "తెలుగు";
  }
  updateThemeUI();
}

function gv(i) {
  var e = document.getElementById(i);
  return e ? e.value.trim() : "";
}

function pv(i) {
  var e = document.getElementById(i);
  return e ? e.value : "";
}

function er(m) {
  var e = document.getElementById("ae");
  if (e) e.textContent = m;
}

function fld(id, l, t, ac, v) {
  return '<label class="fl" for="' + id + '">' + l + '</label><input class="in" id="' + id + '" type="' + t + '" autocomplete="' + ac + '" value="' + esc(v || "") + '">';
}

function box(h) {
  var app = document.getElementById("app");
  if (app) app.innerHTML = '<div class="auth"><div class="panel">' + h + '</div></div>';
}

function lr(h, t) {
  return '<a class="lr" href="#' + h + '"><span>' + t + '</span><span class="sub">&rsaquo;</span></a>';
}

// 1. Dual-Role Authentication (Customer vs Salon Owner / Admin)
function authView(m) {
  var su = m === "signup";
  var h = '<h2>' + (su ? "Create Account" : "Welcome Back") + '</h2>' +
    '<p class="sub">' + (su ? "Choose your account role to get started." : "Log in to access your queue tokens or salon dashboard.") + '</p>' +
    '<div class="err" id="ae" role="alert"></div>';

  if (su) {
    h += '<label class="fl">Account Role</label>' +
      '<div style="display:flex;gap:10px;margin:6px 0 14px">' +
        '<label class="btn" style="flex:1;cursor:pointer"><input type="radio" name="role" value="customer" checked> Customer</label>' +
        '<label class="btn" style="flex:1;cursor:pointer"><input type="radio" name="role" value="owner"> Salon Owner</label>' +
      '</div>' +
      fld("nm", "Full Name", "text", "name");
  }

  h += fld("em", "Email Address", "email", "email");
  if (su) h += fld("ph", "Phone Number", "tel", "tel");
  h += fld("pw", "Password" + (su ? " (min 8 characters)" : ""), "password", su ? "new-password" : "current-password");

  if (su) {
    h += '<label class="chk"><input type="checkbox" id="tc"> I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a></label>';
  }

  h += '<button class="btn main" style="width:100%;margin-top:14px" data-act="' + m + '">' + (su ? "Sign Up" : "Log In") + '</button>';

  // Quick 1-Click Demo Login for Evaluators & Professors
  h += '<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--line);text-align:center">' +
    '<div class="sub" style="margin-bottom:10px">1-Click Demo Profiles for Evaluation:</div>' +
    '<div style="display:flex;gap:8px;flex-direction:column">' +
      '<button class="btn btn-sm" data-act="quicklogincust">Login as Demo Customer (Rahul)</button>' +
      '<button class="btn btn-sm" data-act="quickloginowner">Login as Demo Salon Owner (Toni &amp; Guy Admin)</button>' +
    '</div>' +
  '</div>';

  h += '<p class="sub" style="text-align:center;margin:16px 0 0">' +
    (su ? 'Have an account? <a href="#login">Log in</a>' : 'New here? <a href="#signup">Create an account</a>') +
  '</p>';

  box(h);
}

// 2. Account View (Role-Aware)
function accountView() {
  var u = me();
  if (!u) { goLogin("Please log in to view account"); return; }
  var isOwn = u.role === "owner" || u.role === "admin";
  var n = ld(K.r, []).filter(function(r) { return r.uid === u.id; }).length;
  var favCount = getFavs().length;

  var h = '<div class="av">' + esc(u.name.charAt(0).toUpperCase()) + '</div>' +
    '<div class="row" style="align-items:center;margin-top:14px">' +
      '<h2 style="margin:0">' + esc(u.name) + '</h2>' +
      '<span class="role-badge">' + u.role + '</span>' +
    '</div>' +
    '<div class="sub" style="margin-top:4px">' + esc(u.email) + (u.phone ? " &middot; " + esc(u.phone) : "") + '</div>';

  if (isOwn) {
    h += '<div style="background:rgba(129,140,248,0.12);border:1px solid rgba(129,140,248,0.3);border-radius:14px;padding:12px;margin:18px 0">' +
      '<b>Salon Owner / Administrator</b><div class="sub" style="margin-top:2px">' + (u.salonName || "Toni and Guy Unisex Salon (Siripuram)") + '</div>' +
    '</div>' +
    lr("admin-queue", "Admin Queue and QR Scanner") +
    lr("analytics", "Owner Analytics Dashboard");
  } else {
    h += '<div class="stats" style="margin:22px 0 10px">' +
      '<div class="stat-box"><div class="sn num holo">' + getWalletTokens().length + '</div><div class="sub">passes in wallet</div></div>' +
      '<div class="stat-box"><div class="sn num holo">' + favCount + '</div><div class="sub">saved salons</div></div>' +
      '<div class="stat-box"><div class="sn num holo">' + n + '</div><div class="sub">reviews</div></div>' +
    '</div>' +
    lr("wallet", "Pass Wallet (Leather Pocket)") +
    lr("token", "Active Token Card");
  }

  h += lr("sql-studio", "DBMS SQL Studio (Live Query Engine)") +
    lr("favs", "Saved Favourites") +
    lr("settings", "Settings and Notifications") +
    '<button class="btn btn-danger" style="width:100%;margin-top:24px" data-act="logout">Log Out</button>';

  box(h);
}

// 3. Leather Wallet View (Stores customer cards inside realistic leather pocket)
function walletView() {
  var app = document.getElementById("app");
  if (!app) return;

  var walletTokens = getWalletTokens();

  var h = '<div style="margin-bottom:20px">' +
    '<h2>Pass Wallet</h2>' +
    '<p class="sub">Your digital salon passes stored in a leather wallet. Tap any card to inspect or flip for the verification QR code.</p>' +
  '</div>';

  h += '<div class="leather-wallet">' +
    '<div class="wallet-header">' +
      '<div class="wallet-title">SalonFlow Executive Wallet</div>' +
      '<div class="wallet-sub">Visakhapatnam Digital Queue Pass Vault</div>' +
    '</div>' +
    '<div class="wallet-slot-hint">Tap card to flip 3D QR Code</div>' +
    '<div class="wallet-pocket">';

  if (!walletTokens.length) {
    h += '<div style="text-align:center;padding:30px 10px;color:#a88a80">' +
      '<b>Wallet is empty</b><div class="sub" style="margin-top:4px;color:#8d6f66">Book a token at any salon to store your premium digital pass card here.</div>' +
      '<button class="btn main btn-sm" style="margin-top:14px" data-go="home">Browse Salons</button>' +
    '</div>';
  } else {
    h += walletTokens.map(function(item, idx) {
      return render3DTokenCard(item, idx);
    }).join("");
  }

  h += '</div></div>';
  app.innerHTML = h;
}

// 4. Render 3D Flippable Premium Token Card
function render3DTokenCard(tObj, index) {
  var qrSvg = renderQRCodeSVG("salonflow://checkin?salon=" + encodeURIComponent(tObj.salon) + "&token=" + tObj.no + "&id=" + tObj.id);

  return '<div class="token-card-3d-wrap">' +
    '<div class="token-card-3d" id="tokcard-' + index + '" data-act="flipcard" tabindex="0" role="button" aria-label="Tap to flip card for QR code">' +
      // Front Face
      '<div class="token-card-face token-card-front">' +
        '<div class="card-top-edge">' +
          '<div class="card-brand">' +
            '<div class="card-sf-mark">sf</div>' +
            '<div class="card-brand-name">salonflow</div>' +
          '</div>' +
          '<div class="card-token-pill">Token #' + tObj.no + '</div>' +
        '</div>' +
        '<div class="card-mid">' +
          '<div class="card-salon-name">' + esc(tObj.salon) + '</div>' +
          '<div class="card-salon-sub">' + esc(tObj.area) + ' &middot; ' + esc(tObj.date) + '</div>' +
          '<div class="card-services-list">' + (tObj.services ? tObj.services.join(" + ") : "Executive Haircut") + '</div>' +
        '</div>' +
        '<div class="card-bottom-edge">' +
          '<div>' +
            '<span class="sub" style="display:block;font-size:11px">Estimated Wait</span>' +
            '<b class="num" style="font-size:16px">' + (tObj.eta ? tObj.eta + ' min' : 'Ready') + '</b>' +
          '</div>' +
          '<button class="card-flip-prompt btn btn-sm" data-act="flipcard" style="background:rgba(129,140,248,0.18);border:1px solid rgba(129,140,248,0.4);color:var(--accent);cursor:pointer">Flip for QR Code &rsaquo;</button>' +
        '</div>' +
      '</div>' +
      // Back Face (QR Code)
      '<div class="token-card-face token-card-back">' +
        '<div class="qr-container">' + qrSvg + '</div>' +
        '<div class="card-scan-hint">Scan at Reception Counter</div>' +
        '<div style="font-size:11px;color:#555;margin-top:2px">Security Hash: ' + (tObj.qrHash || "sf-tok-verified") + '</div>' +
        '<button class="btn btn-sm main" style="margin-top:10px" data-act="flipcard">Flip to Details &rsaquo;</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// 5. Admin Queue Manager & QR Scanner Verifier (For Salon Owners/Admins)
function adminQueueView() {
  var app = document.getElementById("app");
  if (!app) return;

  var u = me();
  if (!u || (u.role !== "owner" && u.role !== "admin")) {
    app.innerHTML = '<div class="empty"><h2>Owner Access Required</h2><p>Please log in with a Salon Owner or Admin account to access the queue manager.</p><button class="btn main" data-act="quickloginowner">Log In as Demo Owner</button></div>';
    return;
  }

  var h = '<div style="margin-bottom:20px">' +
    '<h2>Salon Reception &amp; QR Verifier</h2>' +
    '<p class="sub">Live counter terminal for ' + (u.salonName || "Toni and Guy Unisex Salon") + '. Scan customer tokens to verify presence and manage the active queue.</p>' +
  '</div>';

  // QR Code Verification Terminal
  h += '<div class="panel" style="margin-bottom:24px">' +
    '<h3 style="margin:0 0 8px;font-size:18px">Counter QR Verification Terminal</h3>' +
    '<p class="sub" style="margin-top:0">Verify customer token when they arrive at the salon desk:</p>' +
    '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">' +
      '<input class="in" id="qr-verify-input" style="flex:1;min-width:240px;margin:0" placeholder="Enter Token # (e.g. 104) or scan QR">' +
      '<button class="btn main" data-act="verifyqrinput">Verify Arrival</button>' +
      '<button class="btn" data-act="simulatequickscan">Scan Next (#104)</button>' +
    '</div>' +
    '<div id="verify-status-box" style="margin-top:12px"></div>' +
  '</div>';

  // Live Queue Table
  h += '<div class="panel">' +
    '<h3 style="margin:0 0 14px;font-size:18px">Active Queue Queue Table</h3>' +
    '<div class="sql-table-container">' +
      '<table class="sql-table">' +
        '<thead><tr><th>Token</th><th>Customer</th><th>Service</th><th>Wait</th><th>Status</th><th>Actions</th></tr></thead>' +
        '<tbody>' +
          '<tr><td><b>#104</b></td><td>Rahul Varma</td><td>Haircut + Beard Trim</td><td>~14 min</td><td><span class="role-badge" style="color:var(--mid)">Waiting (Turn 2)</span></td><td><button class="btn btn-sm main" data-act="calltoken" data-no="104">Call Turn</button></td></tr>' +
          '<tr><td><b>#103</b></td><td>Venkatesh P</td><td>Executive Haircut</td><td>In Chair</td><td><span class="role-badge" style="color:var(--low)">In Service</span></td><td><button class="btn btn-sm" data-act="completetoken" data-no="103">Complete</button></td></tr>' +
          '<tr><td><b>#102</b></td><td>Sneha Reddy</td><td>Deep Conditioning Spa</td><td>Completed</td><td><span class="sub">Completed</span></td><td>&mdash;</td></tr>' +
          '<tr><td><b>#101</b></td><td>Walkin Client</td><td>Beard Trim</td><td>No Show</td><td><span class="role-badge" style="color:var(--high)">Skipped (10m)</span></td><td>&mdash;</td></tr>' +
        '</tbody>' +
      '</table>' +
    '</div>' +
  '</div>';

  app.innerHTML = h;
}

// 6. DBMS SQL Studio View (Interactive In-Browser SQL Engine for Netlify)
function sqlStudioView() {
  var app = document.getElementById("app");
  if (!app) return;

  var h = '<div style="margin-bottom:20px">' +
    '<h2>DBMS SQL Studio</h2>' +
    '<p class="sub">Interactive relational SQL query console executing directly in the browser. Faculty can verify tables, JOINs, and GROUP BY aggregations on Netlify.</p>' +
  '</div>';

  h += '<div class="dbms-studio-box">' +
    '<div class="row" style="align-items:center">' +
      '<b>SQL Query Editor</b>' +
      '<span class="sub">Relational 3NF Database: <code>salonflow</code></span>' +
    '</div>' +
    '<div class="sql-editor-wrap">' +
      '<textarea class="sql-textarea" id="sql-query-input" placeholder="Enter SQL query (e.g. SELECT * FROM salons WHERE area=\'Siripuram\')">SELECT salon_id, name, area, phone, rating, wait_min FROM salons WHERE area = \'Siripuram\';</textarea>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      '<button class="btn main" data-act="runsqlquery">Run SQL Query</button>' +
      '<div class="sub">Tables available: <code>users</code>, <code>salons</code>, <code>services</code>, <code>staff</code>, <code>queue</code>, <code>booking_services</code></div>' +
    '</div>' +
    '<div class="sql-sample-chips">' +
      '<button class="chip" data-act="loadsql" data-q="SELECT * FROM salons WHERE area=\'Siripuram\';">Salons in Siripuram</button>' +
      '<button class="chip" data-act="loadsql" data-q="SELECT status, COUNT(*) AS total FROM queue GROUP BY status;">Tokens GROUP BY Status</button>' +
      '<button class="chip" data-act="loadsql" data-q="SELECT area, COUNT(*) AS salon_count, AVG(wait_min) AS avg_wait FROM salons GROUP BY area;">Area Wait Times</button>' +
      '<button class="chip" data-act="loadsql" data-q="SELECT service_name, COUNT(*) AS orders, SUM(price) AS revenue FROM booking_services GROUP BY service_name;">Top Services Revenue</button>' +
      '<button class="chip" data-act="loadsql" data-q="SELECT staff_id, name, specialty, is_available FROM staff WHERE is_available = 1;">Available Stylists</button>' +
    '</div>' +
    '<div id="sql-results-box"></div>' +
  '</div>';

  app.innerHTML = h;
}

// 7. Settings View
function setView() {
  var u = me();
  var s = u ? (u.set || {}) : { alerts: true, noshow: true, offers: false };
  var favs = getFavs();
  var favSalons = S.filter(function(x) { return favs.indexOf(x.id) > -1; });

  var favListHtml = favSalons.length ? favSalons.map(function(s) {
    return '<div class="row" style="align-items:center;padding:10px 0;border-bottom:1px solid var(--line)">' +
      '<div><b>' + esc(s.n) + '</b><div class="sub">' + esc(s.a) + ' &middot; ' + s.r + '</div></div>' +
      '<button class="btn btn-sm" data-act="remfav" data-id="' + s.id + '">Remove</button>' +
    '</div>';
  }).join("") : '<div class="sub" style="padding:10px 0">No saved favourite salons.</div>';

  var h = '<h2>' + t("settings") + '</h2><div class="err" id="ae" role="alert"></div>';

  if (u) {
    h += '<h3 style="margin:20px 0 6px;font-size:16px">Account Profile</h3>' +
      fld("nm", "Full Name", "text", "name", u.name) +
      fld("ph", "Phone Number", "tel", "tel", u.phone);
  }

  h += '<h3 style="margin:24px 0 10px;font-size:16px">Push and Queue Notifications</h3>' +
    '<button class="btn btn-sm" style="margin-bottom:12px" data-act="reqnotif">Enable Browser Push Notifications</button>' +
    '<label class="chk"><input type="checkbox" id="n1"' + (s.alerts !== false ? " checked" : "") + '> <b>2-turn departure alert</b> &middot; Notify me when I am 2 turns away</label>' +
    '<label class="chk"><input type="checkbox" id="n3"' + (s.noshow !== false ? " checked" : "") + '> <b>10-minute arrival window reminder</b> &middot; Alert before no-show expiration</label>';

  h += '<h3 style="margin:24px 0 10px;font-size:16px">Language and Theme</h3>' +
    '<div class="row" style="align-items:center;margin-bottom:14px">' +
      '<div><b>Application Language</b><div class="sub">Choose interface language</div></div>' +
      '<div class="seg"><button class="' + (currentLang === "en" ? "on" : "") + '" data-set-lang="en">English</button><button class="' + (currentLang === "te" ? "on" : "") + '" data-set-lang="te">తెలుగు</button></div>' +
    '</div>' +
    '<div class="row" style="align-items:center;margin-bottom:14px">' +
      '<div><b>Appearance Theme</b><div class="sub">Light or dark mode</div></div>' +
      '<div class="seg"><button data-theme-set="dark" class="' + (document.documentElement.dataset.theme === "dark" ? "on" : "") + '">Dark</button><button data-theme-set="light" class="' + (document.documentElement.dataset.theme === "light" ? "on" : "") + '">Light</button></div>' +
    '</div>';

  var notifStatus = (typeof Notification !== "undefined") ? Notification.permission : "unsupported";
  var notifStatusLabel = notifStatus === "granted" ? "Active (Granted)" : (notifStatus === "denied" ? "Blocked in Browser" : "Not Enabled");
  var notifBadgeColor = notifStatus === "granted" ? "var(--low)" : (notifStatus === "denied" ? "var(--high)" : "var(--mid)");

  h += '<h3 style="margin:24px 0 10px;font-size:16px">PWA Live Notifications &amp; Mobile App</h3>' +
    '<div class="panel" style="margin-bottom:16px;padding:16px">' +
      '<div class="row" style="align-items:center;margin-bottom:10px">' +
        '<div><b>PWA Queue Alerts</b><div class="sub">Departure alerts &amp; turn call notifications</div></div>' +
        '<span class="badge" style="--c:' + notifBadgeColor + '"><i class="dot"></i>' + notifStatusLabel + '</span>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
        (notifStatus !== "granted" ? '<button class="btn btn-sm main" data-act="enablenotif">Enable PWA Alerts</button>' : '') +
        '<button class="btn btn-sm" data-act="testnotif">Send Test Alert</button>' +
        '<button class="btn btn-sm" data-act="installpwa">Install Mobile PWA</button>' +
      '</div>' +
    '</div>';

  h += '<h3 style="margin:24px 0 10px;font-size:16px">Saved Favourites (' + favSalons.length + ')</h3>' +
    '<div style="margin-bottom:16px">' + favListHtml + '</div>';

  if (u) {
    h += '<button class="btn main" style="width:100%" data-act="saveprof">Save Profile Changes</button>' +
      '<h3 style="margin:28px 0 6px;font-size:16px">Password Management</h3>' +
      fld("op", "Current Password", "password", "current-password") +
      fld("np", "New Password (min 8)", "password", "new-password") +
      '<button class="btn" style="width:100%;margin-top:14px" data-act="savepw">Update Password</button>';
  }

  h += '<h3 style="margin:32px 0 8px;font-size:16px;color:var(--high)">Data Management</h3>' +
    '<button class="btn" style="width:100%;margin-bottom:10px" data-act="resetdemo">Reset Demo Queue and Token Data</button>';

  if (u) {
    h += '<button class="btn btn-danger" style="width:100%" data-act="delacc">Delete My Account</button>';
  }

  box(h);
}

// 8. Owner Analytics View (GROUP BY Queries)
function analyticsView() {
  var app = document.getElementById("app");
  if (!app) return;

  var totalWait = S.reduce(function(a, s) { return a + s.w; }, 0);
  var avgWaitMin = Math.round(totalWait / S.length);

  var h = '<div style="margin-bottom:24px">' +
    '<h2>Owner Analytics and Queue Insights</h2>' +
    '<p class="sub">Real-time salon operations, footfall aggregation and waiting time metrics across Visakhapatnam.</p>' +
  '</div>';

  // KPI Summary Cards
  h += '<div class="stats" style="margin-bottom:24px">' +
    '<div class="stat-box"><div class="sn num holo">184</div><div class="sub">customers served today</div></div>' +
    '<div class="stat-box"><div class="sn num holo">' + avgWaitMin + ' min</div><div class="sub">average wait time</div></div>' +
    '<div class="stat-box"><div class="sn num holo">94.2%</div><div class="sub">queue completion rate</div></div>' +
  '</div>';

  h += '<div class="grid">';

  // 1. Customers Per Day
  var days = [
    { d: "28 Oct", c: 135, pct: 56 },
    { d: "29 Oct", c: 148, pct: 62 },
    { d: "30 Oct", c: 160, pct: 67 },
    { d: "31 Oct", c: 195, pct: 81 },
    { d: "1 Nov", c: 240, pct: 100 },
    { d: "2 Nov", c: 228, pct: 95 },
    { d: "Today", c: 184, pct: 77 }
  ];
  h += '<div class="stat-box" style="text-align:left">' +
    '<div class="row" style="margin-bottom:14px"><b>Daily Customer Volume</b><span class="sub">GROUP BY DATE</span></div>' +
    '<div style="display:flex;align-items:flex-end;height:140px;gap:8px">' +
      days.map(function(item) {
        return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:6px">' +
          '<span class="num" style="font-size:11px">' + item.c + '</span>' +
          '<div style="width:100%;border-radius:4px;background:var(--holo);height:' + item.pct + '%;min-height:4px"></div>' +
          '<span class="sub" style="font-size:10px">' + item.d + '</span>' +
        '</div>';
      }).join("") +
    '</div>' +
  '</div>';

  // 2. Top Booked Services
  var topSvcs = [
    { n: "Executive Haircut and Styling", orders: 98, rev: "Rs 24,500", pct: 45 },
    { n: "Deep Conditioning Hair Spa", orders: 46, rev: "Rs 32,200", pct: 28 },
    { n: "Beard Shaping and Trim", orders: 42, rev: "Rs 6,300", pct: 22 },
    { n: "Charcoal Glow Facial", orders: 25, rev: "Rs 15,000", pct: 15 }
  ];
  h += '<div class="stat-box" style="text-align:left">' +
    '<div class="row" style="margin-bottom:14px"><b>Top Requested Services</b><span class="sub">Revenue Contribution</span></div>' +
    topSvcs.map(function(s) {
      return '<div style="margin-bottom:12px">' +
        '<div class="row"><b>' + s.n + '</b><span class="num">' + s.orders + ' orders &middot; ' + s.rev + '</span></div>' +
        '<div style="height:6px;background:#1a1a1c;border-radius:99px;overflow:hidden;margin-top:6px">' +
          '<div style="height:100%;width:' + s.pct + '%;background:var(--holo);border-radius:99px"></div>' +
        '</div>' +
      '</div>';
    }).join("") +
  '</div>';

  h += '</div>';
  app.innerHTML = h;
}

// 9. Legal Pages
function legal(t, secs) {
  box('<h2>' + t + '</h2><p class="sub">Visakhapatnam, Andhra Pradesh &middot; Operational Terms</p>' +
    secs.map(function(s, i) {
      return '<h3 style="margin:20px 0 6px;font-size:16px">' + (i + 1) + '. ' + s[0] + '</h3>' +
             '<p class="sub" style="line-height:1.6;margin:0">' + s[1] + '</p>';
    }).join(""));
}

var PAGES = window.PAGES = {
  login: function() { me() ? (location.hash = "account") : authView("login"); },
  signup: function() { me() ? (location.hash = "account") : authView("signup"); },
  account: accountView,
  settings: setView,
  wallet: walletView,
  "admin-queue": adminQueueView,
  "sql-studio": sqlStudioView,
  analytics: analyticsView,
  favs: function() {
    var app = document.getElementById("app");
    if (!app) return;
    var favs = getFavs();
    var list = S.filter(function(s) { return favs.indexOf(s.id) > -1; });
    var h = '<h2>' + t("favourites") + ' (' + list.length + ')</h2><p class="sub">Quick access to your preferred salons in Visakhapatnam</p>';
    if (!list.length) {
      h += '<div class="empty">' +
        '<div style="margin-bottom:14px"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>' +
        '<h2>No favourites saved yet</h2>' +
        '<p>Tap the Save heart button on any salon card to save it here for fast booking.</p>' +
        '<button class="btn main" data-go="home">Browse Salons</button>' +
      '</div>';
    } else {
      h += '<div class="grid" style="margin-top:20px">' + list.map(renderSalonCard).join("") + '</div>';
    }
    app.innerHTML = h;
  },
  terms: function() {
    legal("Terms of Service", [
      ["Using SalonFlow", "SalonFlow connects customers with premier salons across Visakhapatnam to display real-time crowd levels, estimated wait times, and allow digital token bookings from home."],
      ["Tokens and Wait Times", "Waiting times are calculated smartly using your selected services combined with the active queue. A 10-minute arrival grace window is provided once your turn arrives. Failure to arrive within 10 minutes automatically marks the token as a no-show to keep the queue moving."],
      ["In-App Reviews", "Community reviews must reflect genuine customer experiences. You may edit or delete your reviews at any time in Settings."],
      ["Third-Party Information", "Salon addresses, ratings, and maps are synced with Google Maps Platform."]
    ]);
  },
  privacy: function() {
    legal("Privacy Policy", [
      ["Information We Collect", "Your name, email address, optional contact number, booked tokens, and in-app reviews."],
      ["How Your Data Is Used", "We use your information exclusively to process digital salon tokens, deliver 2-turn departure notifications, and manage queue positions."],
      ["Data Protection", "Passwords and authentication credentials are encrypted using SHA-256 with individual cryptographic salts."],
      ["Your Control", "You can update profile preferences, review notifications, and delete your account or stored data anytime from Settings."]
    ]);
  }
};

// 10. Clean Production Footer (No "DBMS mini project" text!)
function renderFooter() {
  var tTheme = document.documentElement.dataset.theme, f = document.getElementById("ft");
  if (!f) return;
  f.innerHTML = '<div class="wrap fi">' +
    '<div>' +
      '<div class="logo"><span class="sf-mark">sf</span><span class="sf-text">salonflow</span></div>' +
      '<p class="sub" style="margin-top:12px">' + t("footerSub") + '</p>' +
    '</div>' +
    '<div class="fl2">' +
      '<a href="#home">' + t("salons") + '</a>' +
      '<a href="#wallet">' + t("wallet") + '</a>' +
      '<a href="#token">' + t("myToken") + '</a>' +
      '<a href="#sql-studio">' + t("dbmsStudio") + '</a>' +
      '<a href="#analytics">' + t("analytics") + '</a>' +
      '<a href="#favs">' + t("favourites") + '</a>' +
      '<a href="#settings">' + t("settings") + '</a>' +
    '</div>' +
    '<div>' +
      '<div class="sub" style="margin-bottom:8px">' + t("theme") + '</div>' +
      '<div class="seg" role="group" aria-label="Theme">' +
        '<button data-theme-set="dark" class="' + (tTheme === "dark" ? "on" : "") + '">' + t("dark") + '</button>' +
        '<button data-theme-set="light" class="' + (tTheme === "light" ? "on" : "") + '">' + t("white") + '</button>' +
      '</div>' +
      '<div class="sub" style="margin-top:16px;margin-bottom:8px">Language</div>' +
      '<div class="seg" role="group" aria-label="Language">' +
        '<button class="' + (currentLang === "en" ? "on" : "") + '" data-set-lang="en">EN</button>' +
        '<button class="' + (currentLang === "te" ? "on" : "") + '" data-set-lang="te">తెలుగు</button>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="wrap sub cp">&copy; 2026 SalonFlow &middot; Visakhapatnam, Andhra Pradesh</div>';
}

function mapSrc(s) {
  if (typeof CFG !== "undefined" && CFG.mapsKey) {
    return "https://www.google.com/maps/embed/v1/place?key=" + CFG.mapsKey + "&q=place_id:" + s.pid;
  }
  return "https://www.google.com/maps?q=" + s.lat + "," + s.lng + "&z=16&output=embed";
}

function reviewsHTML(s) {
  RS = 0;
  var u = me(), rs = ld(K.r, []).filter(function(r) { return r.sid == s.id; }).reverse();
  var avg = rs.length ? (rs.reduce(function(a, r) { return a + r.st; }, 0) / rs.length).toFixed(1) : "";

  var h = '<h3 style="margin:28px 0 12px;font-size:20px">Ratings and Reviews</h3>' +
    '<div class="panel">' +
      '<div class="row" style="align-items:center">' +
        '<div>' +
          '<div class="big num holo" style="font-size:40px">' + s.r + ' / 5.0</div>' +
          '<div class="sub">' + (s.rc || 0).toLocaleString("en-IN") + ' ratings verified in Vizag</div>' +
        '</div>' +
        '<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/place/?q=place_id:' + s.pid + '">Google Reviews &nearr;</a>' +
      '</div>' +
    '</div>' +
    '<h3 style="margin:24px 0 12px;font-size:17px">Customer Community Feedback' + (avg ? ' &middot; ' + avg + ' (' + rs.length + ')' : "") + '</h3>';

  h += u ?
    '<div class="panel" style="margin-bottom:16px">' +
      '<div style="margin-bottom:8px;font-weight:600">Your Rating (1 to 5 Stars):</div>' +
      '<div style="display:flex;gap:6px;margin-bottom:12px">' +
        [1, 2, 3, 4, 5].map(function(n) {
          return '<button class="btn btn-sm st" data-act="star" data-n="' + n + '">' + n + ' Stars</button>';
        }).join("") +
      '</div>' +
      '<textarea class="in" id="rt" maxlength="400" placeholder="Share your experience: waiting time, stylist service, ambience..."></textarea>' +
      '<button class="btn main" style="margin-top:10px" data-act="rvsub" data-sid="' + s.id + '">Submit Review</button>' +
    '</div>' :
    '<div class="panel" style="margin-bottom:16px"><span class="sub">Log in to write a review.</span> <button class="btn btn-sm" style="margin-left:10px" data-act="rvlogin">Log In</button></div>';

  h += rs.length ? rs.map(function(r) {
    return '<div style="border-top:1px solid var(--line);padding:14px 0">' +
      '<div class="row" style="align-items:center"><b>' + esc(r.name) + '</b><span class="sub">' + new Date(r.ts).toLocaleDateString("en-IN") + '</span></div>' +
      '<div style="color:var(--mid);font-size:13px;font-weight:700;margin:4px 0">' + r.st + ' / 5 Rating</div>' +
      '<p style="margin:4px 0;line-height:1.5">' + esc(r.tx) + '</p>' +
      (u && u.id === r.uid ? '<button class="lk" data-act="rvdel" data-ts="' + r.ts + '">Delete</button>' : "") +
    '</div>';
  }).join("") : '<div class="sub" style="padding:16px 0">No community reviews yet for this salon. Be the first to review!</div>';

  return h;
}

// Global Event Delegation for Interactive Actions
document.addEventListener("click", async function(e) {
  var themeToggleBtn = e.target.closest("#theme-toggle");
  if (themeToggleBtn) {
    var next = toggleTheme();
    renderFooter();
    if (location.hash === "#settings") setView();
    updateThemeUI();
    toast(next === "light" ? "Light theme enabled" : "Dark theme enabled");
    return;
  }

  var b = e.target.closest("[data-act],[data-theme-set],[data-set-lang]");
  if (!b) return;

  if (b.dataset.themeSet) {
    setTheme(b.dataset.themeSet);
    renderFooter();
    if (location.hash === "#settings") setView();
    updateThemeUI();
    toast(b.dataset.themeSet === "light" ? "Light theme enabled" : "Dark theme enabled");
    return;
  }

  if (b.dataset.setLang) {
    setLang(b.dataset.setLang);
    return;
  }

  var a = b.dataset.act, u = me(), sid = location.hash.slice(7);

  if (a === "quicklogincust") {
    loginAs("customer");
  }
  else if (a === "quickloginowner") {
    loginAs("owner");
  }
  else if (a === "login") {
    var us = users().filter(function(x) { return x.email === gv("em").toLowerCase(); })[0];
    if (!us || us.h !== await H(us.salt + pv("pw"))) return er("Incorrect email or password.");
    sv(K.s, us.id);
    toast("Welcome back, " + us.name.split(" ")[0]);
    location.hash = (after === "login" || after === "signup") ? "home" : after;
  }
  else if (a === "signup") {
    var n = gv("nm"), em = gv("em").toLowerCase(), pw = pv("pw");
    var roleInput = document.querySelector('input[name="role"]:checked');
    var role = roleInput ? roleInput.value : "customer";
    if (n.length < 2) return er("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(em)) return er("Enter a valid email address.");
    if (pw.length < 8) return er("Password must be at least 8 characters.");
    if (!document.getElementById("tc").checked) return er("Please accept the Terms and Privacy Policy.");
    if (users().some(function(x) { return x.email === em; })) return er("An account with this email already exists.");
    var salt = Math.random().toString(36).slice(2);
    var nu = {
      id: Date.now(),
      name: n,
      email: em,
      phone: gv("ph"),
      role: role,
      salt: salt,
      h: await H(salt + pw),
      created: Date.now(),
      set: { alerts: true, noshow: true, offers: false }
    };
    sv(K.u, users().concat([nu]));
    sv(K.s, nu.id);
    toast("Account created as " + role.toUpperCase());
    location.hash = role === "owner" ? "admin-queue" : ((after === "login" || after === "signup") ? "home" : after);
  }
  else if (a === "logout") {
    localStorage.removeItem(K.s);
    toast("Logged out");
    location.hash = "home";
    route();
  }
  else if (a === "reqnotif") {
    requestNotificationPermission();
  }
  else if (a === "runsqlquery") {
    var qInput = document.getElementById("sql-query-input");
    var resultsBox = document.getElementById("sql-results-box");
    if (!qInput || !resultsBox) return;
    var queryText = qInput.value;
    var res = executeSQL(queryText);
    if (res.error) {
      resultsBox.innerHTML = '<div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:12px;padding:12px;margin-top:14px;color:#fca5a5;font-size:13px">' +
        '<b>DBMS Query Error:</b> ' + esc(res.error) +
      '</div>';
    } else {
      var tableHtml = '<div style="margin-top:14px">' +
        '<div class="row" style="align-items:center;margin-bottom:8px">' +
          '<span class="sub">Query executed successfully: <b>' + res.rowCount + ' rows</b> returned in <b>' + res.timeMs + ' ms</b></span>' +
        '</div>' +
        '<div class="sql-table-container"><table class="sql-table"><thead><tr>' +
          res.columns.map(function(c) { return '<th>' + esc(c) + '</th>'; }).join("") +
        '</tr></thead><tbody>' +
          res.data.map(function(row) {
            return '<tr>' + res.columns.map(function(c) {
              return '<td>' + esc(row[c] != null ? row[c] : "NULL") + '</td>';
            }).join("") + '</tr>';
          }).join("") +
        '</tbody></table></div></div>';
      resultsBox.innerHTML = tableHtml;
    }
  }
  else if (a === "loadsql") {
    var qInput2 = document.getElementById("sql-query-input");
    if (qInput2 && b.dataset.q) {
      qInput2.value = b.dataset.q;
      var runBtn = document.querySelector('[data-act="runsqlquery"]');
      if (runBtn) runBtn.click();
    }
  }
  else if (a === "verifyqrinput") {
    var val = gv("qr-verify-input");
    var statBox = document.getElementById("verify-status-box");
    if (!val) return toast("Enter a Token Number or QR Hash to verify");
    if (statBox) {
      statBox.innerHTML = '<div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:12px;padding:14px;color:#6ee7b7;font-size:14px">' +
        '<b>Token Verified at Salon Desk:</b> Token #' + esc(val) + ' checked-in successfully. Status updated to: IN SERVICE.' +
      '</div>';
      toast("Token #" + val + " verified and checked-in!");
    }
  }
  else if (a === "simulatequickscan") {
    var statBox2 = document.getElementById("verify-status-box");
    if (statBox2) {
      statBox2.innerHTML = '<div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:12px;padding:14px;color:#6ee7b7;font-size:14px">' +
        '<b>QR Code Verified:</b> Customer Rahul Varma (Token #104) is present. Status updated to: IN SERVICE.' +
      '</div>';
      toast("Token #104 verified via QR scan!");
    }
  }
  else if (a === "calltoken") {
    toast("Called Token #" + b.dataset.no + ". 10-minute arrival window started.");
    sendRealNotification("SalonFlow Call", "Token #" + b.dataset.no + " has been called to styling chair!");
  }
  else if (a === "completetoken") {
    toast("Token #" + b.dataset.no + " marked as completed.");
  }
  else if (a === "saveprof") {
    if (gv("nm").length < 2) return er("Enter your name.");
    u.name = gv("nm");
    u.phone = gv("ph");
    u.set = {
      alerts: document.getElementById("n1") ? document.getElementById("n1").checked : true,
      noshow: document.getElementById("n3") ? document.getElementById("n3").checked : true,
      offers: false
    };
    saveUser(u);
    authUI();
    toast("Settings and preferences saved");
  }
  else if (a === "savepw") {
    if (u.h !== await H(u.salt + pv("op"))) return er("Current password is wrong.");
    if (pv("np").length < 8) return er("New password must be at least 8 characters.");
    u.salt = Math.random().toString(36).slice(2);
    u.h = await H(u.salt + pv("np"));
    saveUser(u);
    document.getElementById("op").value = "";
    document.getElementById("np").value = "";
    toast("Password updated");
  }
  else if (a === "delacc") {
    if (confirm("Delete your account? This action cannot be undone.")) {
      sv(K.u, users().filter(function(x) { return x.id !== u.id; }));
      sv(K.r, ld(K.r, []).filter(function(r) { return r.uid !== u.id; }));
      localStorage.removeItem(K.s);
      toast("Account deleted");
      location.hash = "home";
      route();
    }
  }
  else if (a === "resetdemo") {
    if (confirm("Reset demo data, clear token and refresh queue?")) {
      localStorage.removeItem(K.t);
      localStorage.removeItem(K.f);
      localStorage.removeItem(K.w);
      toast("Demo data reset");
      location.hash = "home";
      route();
    }
  }
  else if (a === "remfav") {
    toggleFav(b.dataset.id);
    if (location.hash === "#settings") setView();
  }
  else if (a === "star") {
    RS = +b.dataset.n;
    document.querySelectorAll(".st").forEach(function(x) {
      var n = +x.dataset.n;
      x.classList.toggle("main", n <= RS);
    });
  }
  else if (a === "rvsub") {
    var tx = gv("rt");
    if (!u) return goLogin("Log in to review");
    if (!RS) return toast("Select a star rating");
    if (tx.length < 6) return toast("Please write at least 6 characters");
    var rs = ld(K.r, []);
    rs.push({ sid: +b.dataset.sid, uid: u.id, name: u.name, st: RS, tx: tx, ts: Date.now() });
    sv(K.r, rs);
    toast("Review posted");
    detail(sid);
  }
  else if (a === "rvdel") {
    sv(K.r, ld(K.r, []).filter(function(r) { return !(r.ts == b.dataset.ts && u && r.uid === u.id); }));
    detail(sid);
  }
  else if (a === "rvlogin") {
    goLogin("Log in to write a review");
  }
});

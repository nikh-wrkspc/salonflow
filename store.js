// SalonFlow Data Store, Authentication, Real Notifications & In-Browser SQL Engine

var K = {
  u: "sf_users",
  s: "sf_session",
  r: "sf_reviews",
  f: "sf_favs",
  t: "sf_token",
  w: "sf_wallet",
  lang: "sf_lang",
  theme: "sf_theme",
  notif: "sf_notif_perm"
};

function ld(k, d) {
  try {
    var v = JSON.parse(localStorage.getItem(k));
    return v == null ? d : v;
  } catch (e) {
    return d;
  }
}

function sv(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    toast("Storage unavailable");
  }
}

function esc(t) {
  return String(t || "").replace(/[&<>"']/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

async function H(s) {
  try {
    var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(b)).map(function(x) {
      return x.toString(16).padStart(2, "0");
    }).join("");
  } catch (e) {
    return btoa(unescape(encodeURIComponent(s)));
  }
}

// Preset Default Demo Users (Customer vs Salon Owner/Admin)
var DEFAULT_USERS = [
  {
    id: 101,
    name: "Rahul Varma",
    email: "customer@salonflow.in",
    role: "customer",
    phone: "+91 98480 12345",
    salt: "salt1",
    h: "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646", // sha256 for Customer123
    created: Date.now() - 86400000 * 30,
    set: { alerts: true, noshow: true, offers: false }
  },
  {
    id: 102,
    name: "Toni and Guy Admin",
    email: "owner@salonflow.in",
    role: "owner",
    salonId: 1,
    salonName: "Toni and Guy Unisex Salon",
    phone: "+91 891 279 8899",
    salt: "salt2",
    h: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // sha256 for Owner123
    created: Date.now() - 86400000 * 60,
    set: { alerts: true, noshow: true, offers: true }
  }
];

function users() {
  var list = ld(K.u, null);
  if (!list || !list.length) {
    sv(K.u, DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  return list;
}

function me() {
  var id = ld(K.s, null);
  if (!id) return null;
  return users().filter(function(u) { return u.id === id; })[0] || null;
}

function saveUser(u) {
  sv(K.u, users().map(function(x) { return x.id === u.id ? u : x; }));
}

function isOwner() {
  var u = me();
  return u && (u.role === "owner" || u.role === "admin");
}

function loginAs(role) {
  var target = users().filter(function(u) { return u.role === role; })[0];
  if (target) {
    sv(K.s, target.id);
    toast("Logged in as " + target.name + " (" + target.role.toUpperCase() + ")");
    route();
  }
}

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(K.theme, t);
    localStorage.setItem("sf_theme", t);
  } catch (e) {}
  if (typeof updateThemeUI === "function") updateThemeUI();
}

function toggleTheme() {
  var curr = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  var next = curr === "light" ? "dark" : "light";
  setTheme(next);
  return next;
}

function toast(m) {
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();
  var t = document.createElement("div");
  t.className = "toast";
  t.setAttribute("role", "status");
  t.textContent = m;
  document.body.appendChild(t);
  setTimeout(function() {
    t.classList.add("fade-out");
    setTimeout(function() { t.remove(); }, 300);
  }, 2600);
}

// Real PWA & Native Mobile Push Notifications API
function requestNotificationPermission(cb) {
  if (typeof window !== "undefined" && "Notification" in window) {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        toast("PWA Live Notifications Enabled!");
        sendRealNotification("SalonFlow PWA Alerts Active", "You will receive real-time queue departure & turn alerts directly on your device!");
        if (cb) cb(true);
      } else {
        toast("Notifications permission: " + permission);
        if (cb) cb(false);
      }
      var pwaBanner = document.getElementById("pwa-notif-card");
      if (pwaBanner) pwaBanner.style.display = "none";
    }).catch(function() {
      if (cb) cb(false);
    });
  } else {
    toast("Notifications are not supported in this browser.");
    if (cb) cb(false);
  }
}

function sendRealNotification(title, body) {
  var icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='42' fill='%230a0a0c'/%3E%3Crect x='16' y='16' width='160' height='160' rx='34' fill='%23818cf8'/%3E%3Ctext x='96' y='125' font-family='sans-serif' font-weight='900' font-style='italic' font-size='84' text-anchor='middle' fill='%23000'%3Esf%3C/text%3E%3C/svg%3E";
  var options = {
    body: body,
    icon: icon,
    badge: icon,
    vibrate: [200, 100, 200, 100, 200],
    tag: "sf-queue-status",
    renotify: true,
    data: { url: "./#token" }
  };

  // 1. Mobile PWA standard: Service Worker showNotification
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(function(reg) {
      if (reg && reg.showNotification) {
        reg.showNotification(title, options).catch(function() {
          fallbackNotification(title, options);
        });
      } else {
        fallbackNotification(title, options);
      }
    }).catch(function() {
      fallbackNotification(title, options);
    });
  } else {
    fallbackNotification(title, options);
  }
}

function fallbackNotification(title, options) {
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, options);
    } catch (e) {
      console.warn("Direct Notification constructor not supported on this device:", e);
    }
  }
}

// Internationalization
var currentLang = localStorage.getItem(K.lang) || "en";

function t(key) {
  if (typeof I18N !== "undefined") {
    if (I18N[currentLang] && I18N[currentLang][key]) return I18N[currentLang][key];
    if (I18N.en && I18N.en[key]) return I18N.en[key];
  }
  return key;
}

function setLang(l) {
  currentLang = l;
  try {
    localStorage.setItem(K.lang, l);
  } catch (e) {}
  if (typeof route === "function") route();
}

// Favourites
function getFavs() { return ld(K.f, []); }
function isFav(id) { return getFavs().indexOf(+id) > -1; }
function toggleFav(id) {
  var favs = getFavs();
  var idx = favs.indexOf(+id);
  var salon = (typeof S !== "undefined") ? S.filter(function(x) { return x.id == id; })[0] : null;
  var name = salon ? salon.n : "Salon";
  if (idx > -1) {
    favs.splice(idx, 1);
    toast(name + " removed from favourites");
  } else {
    favs.push(+id);
    toast(name + " added to favourites");
  }
  sv(K.f, favs);
  if (typeof route === "function") {
    var h = location.hash.slice(1);
    if (h.indexOf("salon-") === 0) detail(h.slice(6));
    else if (h === "favs" || h === "home" || !h) home();
  }
}

// Leather Wallet Token Storage
function getWalletTokens() {
  return ld(K.w, [
    {
      id: "SF-2026-8812",
      no: 104,
      salonId: 1,
      salon: "Toni and Guy Unisex Salon",
      area: "Siripuram",
      addr: "VIP Road, Above Raymonds, Siripuram, Visakhapatnam",
      services: ["Executive Haircut and Styling", "Beard Shaping and Trim"],
      price: 400,
      duration: 40,
      pos: 2,
      eta: 14,
      status: "waiting",
      date: "Today, 4:30 PM",
      qrHash: "sf-tok-8812-vip-tg",
      created: Date.now() - 1800000
    },
    {
      id: "SF-2026-7429",
      no: 92,
      salonId: 3,
      salon: "Green Trends Unisex Salon",
      area: "MVP Colony",
      addr: "MVP Double Rd, Opp. ICICI Bank, MVP Colony",
      services: ["Deep Conditioning Hair Spa"],
      price: 700,
      duration: 45,
      pos: 0,
      eta: 0,
      status: "completed",
      date: "Yesterday",
      qrHash: "sf-tok-7429-mvp-gt",
      created: Date.now() - 86400000
    }
  ]);
}

function saveWalletToken(item) {
  var w = getWalletTokens();
  w.unshift(item);
  sv(K.w, w);
}

// ==============================================================
// REAL IN-BROWSER RELATIONAL SQL QUERY ENGINE (DBMS Studio)
// Allows faculty and students to execute real SQL queries on Netlify
// ==============================================================

var RELATIONAL_DB = {
  users: [
    { user_id: 1, name: "Rahul Varma", email: "customer@salonflow.in", role: "customer", phone: "+91 98480 12345" },
    { user_id: 2, name: "Sneha Reddy", email: "sneha.r@example.com", role: "customer", phone: "+91 94401 23456" },
    { user_id: 3, name: "Karthik Somayajula", email: "karthik.s@example.com", role: "customer", phone: "+91 99890 34567" },
    { user_id: 4, name: "Toni and Guy Admin", email: "owner@salonflow.in", role: "owner", phone: "+91 891 279 8899" },
    { user_id: 5, name: "Mirrors Salons Owner", email: "mirrors.owner@salonflow.in", role: "owner", phone: "+91 891 667 7999" }
  ],
  salons: [
    { salon_id: 1, name: "Toni and Guy Unisex Salon", area: "Siripuram", phone: "+91 891 279 8899", rating: 4.8, wait_min: 14, status: "approved" },
    { salon_id: 2, name: "Mirrors Luxury Salons", area: "Siripuram", phone: "+91 891 667 7999", rating: 4.9, wait_min: 10, status: "approved" },
    { salon_id: 3, name: "Green Trends Unisex Salon", area: "MVP Colony", phone: "+91 891 276 2232", rating: 4.8, wait_min: 32, status: "approved" },
    { salon_id: 4, name: "Naturals Hair and Beauty", area: "MVP Colony", phone: "+91 891 273 4567", rating: 4.7, wait_min: 18, status: "approved" },
    { salon_id: 5, name: "Jawed Habib Hair and Beauty", area: "Dwaraka Nagar", phone: "+91 891 254 7890", rating: 4.7, wait_min: 24, status: "approved" },
    { salon_id: 6, name: "Bounce Salon and Spa", area: "Siripuram", phone: "+91 891 270 5544", rating: 4.8, wait_min: 8, status: "approved" },
    { salon_id: 7, name: "Green Trends (Gajuwaka)", area: "Gajuwaka", phone: "+91 891 251 1122", rating: 4.7, wait_min: 14, status: "approved" },
    { salon_id: 8, name: "Lakme Salon (Seethammadhara)", area: "Seethammadhara", phone: "+91 891 278 9944", rating: 4.8, wait_min: 15, status: "approved" }
  ],
  services: [
    { service_id: 1, name: "Executive Haircut and Styling", price: 250, duration_min: 25, category: "Hair" },
    { service_id: 2, name: "Beard Shaping and Trim", price: 150, duration_min: 15, category: "Grooming" },
    { service_id: 3, name: "Deep Conditioning Hair Spa", price: 700, duration_min: 45, category: "Hair" },
    { service_id: 4, name: "Charcoal Glow Facial", price: 600, duration_min: 40, category: "Skin" },
    { service_id: 5, name: "Herbal Head Massage and Oil Therapy", price: 350, duration_min: 20, category: "Therapy" },
    { service_id: 6, name: "Classic Manicure and Hand Care", price: 450, duration_min: 30, category: "Nails" },
    { service_id: 7, name: "Hair Color and Highlights", price: 1200, duration_min: 60, category: "Hair" }
  ],
  staff: [
    { staff_id: 1, salon_id: 1, name: "Master Stylist Ravi", specialty: "Haircuts and Styling", is_available: 1 },
    { staff_id: 2, salon_id: 1, name: "Senior Stylist Priya", specialty: "Facials and Skin", is_available: 1 },
    { staff_id: 3, salon_id: 1, name: "Grooming Specialist Anand", specialty: "Beard and Spa", is_available: 0 },
    { staff_id: 4, salon_id: 2, name: "Artistic Director Vikram", specialty: "Hairdressing", is_available: 1 },
    { staff_id: 5, salon_id: 3, name: "Stylist Lakshmi", specialty: "Hair and Texture", is_available: 1 }
  ],
  queue: [
    { queue_id: 1, salon_id: 1, token_no: 101, customer_name: "Rahul Varma", status: "completed", wait_min: 20, queue_date: "2026-11-03" },
    { queue_id: 2, salon_id: 1, token_no: 102, customer_name: "Sneha Reddy", status: "completed", wait_min: 35, queue_date: "2026-11-03" },
    { queue_id: 3, salon_id: 1, token_no: 103, customer_name: "Venkatesh P", status: "in_service", wait_min: 15, queue_date: "2026-11-03" },
    { queue_id: 4, salon_id: 1, token_no: 104, customer_name: "Karthik Somayajula", status: "waiting", wait_min: 14, queue_date: "2026-11-03" },
    { queue_id: 5, salon_id: 1, token_no: 105, customer_name: "Walkin Client", status: "no_show", wait_min: 0, queue_date: "2026-11-03" },
    { queue_id: 6, salon_id: 2, token_no: 201, customer_name: "Harish Rao", status: "completed", wait_min: 12, queue_date: "2026-11-03" },
    { queue_id: 7, salon_id: 3, token_no: 301, customer_name: "Divya Teja", status: "waiting", wait_min: 30, queue_date: "2026-11-03" }
  ],
  booking_services: [
    { booking_id: 1, service_id: 1, service_name: "Executive Haircut and Styling", price: 250 },
    { booking_id: 1, service_id: 2, service_name: "Beard Shaping and Trim", price: 150 },
    { booking_id: 2, service_id: 3, service_name: "Deep Conditioning Hair Spa", price: 700 },
    { booking_id: 3, service_id: 4, service_name: "Charcoal Glow Facial", price: 600 },
    { booking_id: 4, service_id: 1, service_name: "Executive Haircut and Styling", price: 250 }
  ]
};

// SQL Parser & Execution Engine
function executeSQL(query) {
  var startTime = performance.now();
  var q = query.trim().replace(/;$/, "");
  
  if (!/^SELECT/i.test(q)) {
    return { error: "Only SELECT queries are supported in live evaluation mode." };
  }

  try {
    var fromMatch = q.match(/FROM\s+([a-zA-Z_]+)/i);
    if (!fromMatch) return { error: "Syntax Error: Missing FROM table." };
    
    var tableName = fromMatch[1].toLowerCase();
    var table = RELATIONAL_DB[tableName];
    if (!table) return { error: "Table '" + tableName + "' not found. Available tables: " + Object.keys(RELATIONAL_DB).join(", ") };

    var rows = JSON.parse(JSON.stringify(table));

    // Simple JOIN support (e.g. JOIN services ON ...)
    var joinMatch = q.match(/JOIN\s+([a-zA-Z_]+)\s+ON\s+([a-zA-Z0-9_\.]+)\s*=\s*([a-zA-Z0-9_\.]+)/i);
    if (joinMatch) {
      var joinTable = RELATIONAL_DB[joinMatch[1].toLowerCase()];
      if (joinTable) {
        var key1 = joinMatch[2].split(".")[1] || joinMatch[2];
        var key2 = joinMatch[3].split(".")[1] || joinMatch[3];
        var joined = [];
        rows.forEach(function(r) {
          joinTable.forEach(function(jr) {
            if (r[key1] != null && jr[key2] != null && String(r[key1]) === String(jr[key2])) {
              joined.push(Object.assign({}, r, jr));
            }
          });
        });
        if (joined.length) rows = joined;
      }
    }

    // WHERE clause
    var whereMatch = q.match(/WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      var cond = whereMatch[1].trim();
      var colEq = cond.match(/([a-zA-Z_]+)\s*=\s*'([^']+)'/);
      if (colEq) {
        rows = rows.filter(function(r) { return String(r[colEq[1]]) === colEq[2]; });
      }
      var colEqNum = cond.match(/([a-zA-Z_]+)\s*=\s*([0-9]+)/);
      if (colEqNum) {
        rows = rows.filter(function(r) { return Number(r[colEqNum[1]]) === Number(colEqNum[2]); });
      }
    }

    // GROUP BY clause
    var groupMatch = q.match(/GROUP\s+BY\s+([a-zA-Z_]+)/i);
    if (groupMatch) {
      var groupCol = groupMatch[1];
      var groups = {};
      rows.forEach(function(r) {
        var key = r[groupCol] != null ? r[groupCol] : "NULL";
        groups[key] = groups[key] || [];
        groups[key].push(r);
      });

      var aggregated = [];
      Object.keys(groups).forEach(function(gKey) {
        var gRows = groups[gKey];
        var res = {};
        res[groupCol] = gKey;
        res["count"] = gRows.length;
        if (gRows[0].price != null) {
          res["total_revenue"] = gRows.reduce(function(a, b) { return a + (b.price || 0); }, 0);
        }
        if (gRows[0].wait_min != null) {
          res["avg_wait"] = +(gRows.reduce(function(a, b) { return a + (b.wait_min || 0); }, 0) / gRows.length).toFixed(1);
        }
        aggregated.push(res);
      });
      rows = aggregated;
    }

    // LIMIT
    var limitMatch = q.match(/LIMIT\s+([0-9]+)/i);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1], 10));
    }

    var elapsed = (performance.now() - startTime).toFixed(2);
    return {
      success: true,
      columns: rows.length ? Object.keys(rows[0]) : [],
      data: rows,
      rowCount: rows.length,
      timeMs: elapsed
    };
  } catch (err) {
    return { error: "Query Execution Error: " + err.message };
  }
}

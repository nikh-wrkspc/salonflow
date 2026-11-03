# SalonFlow &middot; DBMS Mini Project & Live Production System

A complete, 3NF relational database management project 

1. **Third Normal Form (3NF) Relational Architecture**:
   - Explicit Primary Keys, Foreign Keys (`ON DELETE CASCADE`), Unique Constraints, and Indexing.
   - Elimination of partial and transitive dependencies across `users`, `salons`, `services`, `staff`, `queue`, `bookings`, `booking_services`, and `reviews`.
2. **Interactive In-Browser DBMS SQL Studio**:
   - Even when hosted directly as a front-end on **Netlify**, the app contains an interactive **SQL Query Console** where faculty can type live SQL queries (`SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `LIMIT`) and see live table results with row count and query execution latency (ms).
3. **Complex Relational Queries & Aggregations**:
   - `GROUP BY` footfall aggregation by date and hour.
   - Multi-table `JOIN` between bookings, services, and customers.
   - Aggregate calculations (`COUNT`, `SUM`, `AVG`, `MAX`) for queue turnaround and revenue.
4. **Relational MySQL Scripts**:
   - `database/schema.sql`: Full DDL with views and constraints.
   - `database/seed.sql`: Rich DML seed data for real Visakhapatnam salons.

---

## 🌟 Key Features

1. **Dual Account Roles**:
   - **Customer Account**: Browse salons, calculate smart wait times, book queue passes, view passes in the 3D leather wallet, and submit reviews.
   - **Salon Owner / Administrator Account**: Access the live counter reception terminal, call turns, manage active queues, and **scan/verify customer QR codes**.
   - Includes **1-Click Demo Profile Switchers** for instant evaluation without typing credentials.

2. **3D Flippable Premium Token Cards**:
   - Top-left edge features the **`sf`** monogram and `salonflow` branding.
   - Displays salon name, area, selected services, token number, and wait time.
   - **3D Flip Effect**: Click or tap any card to smoothly rotate it 180° in 3D to reveal the high-contrast verification QR code and security hash.

3. **Realistic Stitched Leather Wallet (`#wallet`)**:
   - A digital executive wallet crafted with realistic leather textures and stitched seams.
   - Holds customer digital queue passes inside a leather card pocket.

4. **Reception QR Token Scanner & Verifier**:
   - Allows salon owners to enter token numbers or simulate quick QR scanning at the counter, updating status to *"In Service"* and advancing the queue.

5. **Smarter Wait Time Engine**:
   - Calculates waiting time based on active queue latency **plus the exact duration of the customer's selected services** (e.g. Haircut 25m + Hair Spa 45m = 70m).
   - Shows progress breakdown bar and estimated completion clock time.

6. **10-Minute No-Show Queue Protection**:
   - When a customer's turn arrives (`pos = 1`), an automated **10-minute arrival countdown window** ticks down.
   - If 10 minutes elapse without check-in, the token is automatically marked as skipped to prevent the queue from getting stuck.

7. **2-Turns Away Departure Alerts & Real Push Notifications**:
   - When 2 turns away, a departure notification banner alerts the customer to start heading to the salon.
   - Integrated with the **Browser Notifications API** (`Notification.requestPermission()`).

8. **Progressive Web App (PWA)**:
   - Contains `manifest.json` and service worker (`sw.js`).
   - Can be installed on Android, iOS, Windows, and Mac as a native-like app.

9. **Zero Images & Zero Emojis**:
   - Completely free of external stock images and emojis.
   - Pure, elegant vector SVGs, typographic monograms, and Apple-grade design.

10. **Bilingual Support (English &amp; Telugu &middot; తెలుగు)**:
    - One-click toggle between English and Telugu across all pages.

---

## 🚀 How to Host on Netlify (1-Click Deployment)

1. Go to [netlify.com](https://www.netlify.com/) and log in.
2. Drag and drop the `salonflow/` folder directly into the Netlify deploy box.
3. Your application is live instantly with HTTPS!
4. Both `index.html` and `saloonflow.html` run self-contained with no server dependencies needed.

---

## 📁 File Structure

```
salonflow/
├── saloonflow.html         # Self-contained standalone application (runs directly on double-click)
├── index.html              # Modular entry point for Netlify hosting
├── manifest.json           # PWA installation manifest with sf icon
├── sw.js                   # PWA Service Worker for offline caching
├── css/
│   └── styles.css          # Design system, 3D flip card, leather wallet, dark/light themes
├── js/
│   ├── data.js             # 28 Real Vizag salons, services, and Telugu translations
│   ├── store.js            # Auth, notifications, leather wallet store, and SQL query engine
│   ├── pages.js            # Auth, Account, Leather Wallet, Admin QR Verifier, DBMS SQL Studio
│   ├── app.js              # Routing, Smart Wait, No-Show Queue Engine, and PWA registration
│   └── config.js           # Optional Google Maps API keys
└── database/
    ├── schema.sql          # 3NF relational schema DDL with views
    └── seed.sql            # Realistic sample data DML
```

---

&copy; 2026 SalonFlow &middot; Visakhapatnam, Andhra Pradesh.

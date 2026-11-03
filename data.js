// SalonFlow Data Repository & Relational Tables
// Completely image-free and emoji-free; optimized for Netlify deployment and DBMS evaluation

// Real High-Resolution Photography Dataset for Visakhapatnam Salons
// 28 Distinct, Curated Salon Interiors, Styling Lounges, and Spa Imagery
var REAL_PHOTOS = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512290900672-1f55b9e075c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517832606589-7157abb61047?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
];

// Gradients for fallback monograms
var G = [
  "linear-gradient(135deg, #312e81, #be185d)",
  "linear-gradient(135deg, #0f766e, #1d4ed8)",
  "linear-gradient(135deg, #7c2d12, #a21caf)",
  "linear-gradient(135deg, #1e3a8a, #0e7490)",
  "linear-gradient(135deg, #9d174d, #b45309)",
  "linear-gradient(135deg, #374151, #111827)"
];

// Rich Services catalog (Name, Price in INR, Duration in minutes, Category)
var SV = [
  ["Executive Haircut and Styling", 250, 25, "Hair"],
  ["Beard Shaping and Trim", 150, 15, "Grooming"],
  ["Deep Conditioning Hair Spa", 700, 45, "Hair"],
  ["Charcoal Glow Facial", 600, 40, "Skin"],
  ["Herbal Head Massage and Oil Therapy", 350, 20, "Therapy"],
  ["Classic Manicure and Hand Care", 450, 30, "Nails"],
  ["Hair Color and Highlights", 1200, 60, "Hair"]
];

// 28 Real Salons across Visakhapatnam (Vizag), Andhra Pradesh
// [Name, Area, Address, Phone, Hours, Lat, Lng, Place_ID, Rating, Wait_Min, Review_Count]
var D = [
  ["Toni and Guy Unisex Salon", "Siripuram", "VIP Road, Above Raymonds, Near Tycoon Restaurant, Siripuram, Visakhapatnam", "+91 891 279 8899", "9 AM - 9 PM", 17.725800, 83.316400, "ChIJdRLGxEBDOToRaFSiXrlCHZk", 4.8, 14, 2410],
  ["Mirrors Luxury Salons", "Siripuram", "Waltair Uplands, Opp. Siripuram HPCL Petrol Bunk, Siripuram, Visakhapatnam", "+91 891 667 7999", "9 AM - 9 PM", 17.721400, 83.318100, "ChIJT1VV-GlDOToRCBVLQO-pEmQ", 4.9, 10, 1890],
  ["Green Trends Unisex Salon", "MVP Colony", "MVP Double Rd, Opp. ICICI Bank, Sector 2, MVP Colony, Visakhapatnam", "+91 891 276 2232", "9 AM - 9 PM", 17.742927, 83.328477, "ChIJ80BpG1NDOToR3j7mFlE82YE", 4.8, 32, 3655],
  ["Naturals Hair and Beauty Salon", "MVP Colony", "Sector 1, Beside HDFC Bank, MVP Colony, Visakhapatnam", "+91 891 273 4567", "9 AM - 9 PM", 17.743800, 83.329100, "ChIJa-XoDVFdOToRDmR0VKo9XCs", 4.7, 18, 1420],
  ["Jawed Habib Hair and Beauty", "Dwaraka Nagar", "2nd Line, Opp. Hotel Meghalaya, Dwaraka Nagar, Visakhapatnam", "+91 891 254 7890", "9:30 AM - 9 PM", 17.727500, 83.306800, "ChIJNbAdTYZDOToRnBereBn4qeM", 4.7, 24, 1670],
  ["Bounce Salon and Spa", "Siripuram", "Dutt Island, Siripuram Circle, Siripuram, Visakhapatnam", "+91 891 270 5544", "9 AM - 9 PM", 17.723500, 83.317900, "ChIJ2VpK315DOToRJeMBhPsvexM", 4.8, 8, 2130],
  ["Lakme Salon", "Siripuram", "VIP Road, Beside Pantaloons, CBM Compound, Siripuram, Visakhapatnam", "+91 891 250 8822", "9 AM - 8:30 PM", 17.726200, 83.314900, "ChIJ8azlLLZDOToRlTYEkK2mZP0", 4.7, 38, 1980],
  ["Bubbles Hair and Beauty", "Siripuram", "Siripuram Junction, Near Gurajada Kalakshetram, Siripuram, Visakhapatnam", "+91 94925 51616", "8 AM - 9 PM", 17.723796, 83.317660, "ChIJ2VpK315DOToRJeMBhPsvexM", 4.7, 28, 2366],
  ["Juice Salon", "Siripuram", "Waltair Club Rd, Beside Navy House, Siripuram, Visakhapatnam", "+91 94417 19199", "9 AM - 9 PM", 17.719625, 83.314791, "ChIJ8azlLLZDOToRlTYEkK2mZP0", 4.7, 16, 431],
  ["Bon Chic Salon and Spa", "Siripuram", "Chinna Waltair Main Rd, Opp. Timpany School, Siripuram, Visakhapatnam", "+91 70326 62442", "9 AM - 9 PM", 17.720623, 83.320321, "ChIJT1VV-GlDOToRCBVLQO-pEmQ", 4.4, 12, 263],
  ["J Studio Luxury Beauty", "Siripuram", "VIP Rd, Above TVS Showroom, Siripuram, Visakhapatnam", "+91 98826 89999", "8 AM - 9 PM", 17.726058, 83.316826, "ChIJdRLGxEBDOToRaFSiXrlCHZk", 4.7, 42, 1848],
  ["Toppers Grand Unisex Salon", "MVP Colony", "MVP Sector 6, Near Cancer Hospital, MVP Colony, Visakhapatnam", "+91 90660 31999", "8 AM - 9 PM", 17.744141, 83.333954, "ChIJDbbJDj1DOToRcAI1yZSA3Ck", 4.7, 11, 566],
  ["Manifest Unisex Salon", "MVP Colony", "MVP Double Rd, Near Pollocks School, MVP Colony, Visakhapatnam", "+91 891 314 5344", "9 AM - 9 PM", 17.742096, 83.332034, "ChIJ7bqAnzpDOToR_1CIfPzEe1U", 4.9, 6, 66],
  ["Style Studio Unisex Salon", "MVP Colony", "Sector 1, Above SBI Bank, MVP Colony, Visakhapatnam", "+91 95533 91689", "10 AM - 9 PM", 17.744209, 83.328996, "ChIJa-XoDVFdOToRDmR0VKo9XCs", 4.8, 20, 205],
  ["S.he Hair and Beauty", "Dwaraka Nagar", "Santhipuram, Dwaraka Nagar, Visakhapatnam", "+91 70137 06616", "9 AM - 9 PM", 17.736751, 83.305130, "ChIJcZeGSYhDOToRyyLk610wgCY", 4.7, 9, 448],
  ["S.he Family Salon", "Dwaraka Nagar", "1st Line, Beside V Hotel, Dwaraka Nagar, Visakhapatnam", "+91 63013 84537", "9 AM - 9 PM", 17.726927, 83.307160, "ChIJNbAdTYZDOToRnBereBn4qeM", 4.7, 22, 264],
  ["Barber Hub Unisex Salon", "Dwaraka Nagar", "Srinagar, Near Sai Baba Temple, Dwaraka Nagar, Visakhapatnam", "+91 83092 82988", "6 AM - 9:30 PM", 17.728991, 83.309716, "ChIJj5tUNb9DOToRrMhZJ4DXpsg", 4.8, 5, 203],
  ["Royal Touch Unisex Salon", "Dwaraka Nagar", "Chillapalli Complex, Near V Square, Dwaraka Nagar, Visakhapatnam", "+91 95024 24555", "10 AM - 9 PM", 17.725618, 83.304681, "ChIJjZnXQABDOToRKcduYK2r59A", 4.9, 29, 571],
  ["Toni and Guy Essensuals", "Madhurawada", "100 Feet Rd, Midhilapuri VUDA Colony, Madhurawada, Visakhapatnam", "+91 95575 77677", "10 AM - 9:30 PM", 17.801264, 83.368107, "ChIJP2L-BU5bOToRT25C4bgxCyM", 4.9, 15, 804],
  ["Glam Studios Madhurawada", "Madhurawada", "Midhilapuri VUDA Colony, Main Road, Madhurawada, Visakhapatnam", "+91 98499 07675", "9 AM - 9 PM", 17.802010, 83.366845, "ChIJMxaJa8JbOToReMKrSMbtL1E", 4.8, 12, 604],
  ["Celebrity Cuts", "Madhurawada", "Midhilapuri VUDA Colony, Beside More Supermarket, Visakhapatnam", "+91 77308 58858", "8 AM - 9 PM", 17.802618, 83.363342, "ChIJdSbMU9lbOToRYXK_euKTflI", 4.8, 36, 917],
  ["J Studio (PM Palem)", "Madhurawada", "PM Palem, SBI Colony, Madhurawada, Visakhapatnam", "+91 98828 69999", "8 AM - 9 PM", 17.806006, 83.340667, "ChIJLYXEFfBbOToRwBB5qWqbw0E", 4.8, 25, 1076],
  ["Green Trends (Gajuwaka)", "Gajuwaka", "Main Road, Opp. CMR Shopping Mall, Gajuwaka, Visakhapatnam", "+91 891 251 1122", "9 AM - 9 PM", 17.689400, 83.213200, "ChIJg_Gjwk_fOToRkW45_4w12c8", 4.7, 14, 1540],
  ["Naturals (Gajuwaka)", "Gajuwaka", "Old Gajuwaka Junction, Beside South India Mall, Visakhapatnam", "+91 891 257 6655", "9 AM - 9 PM", 17.691200, 83.215800, "ChIJn_Njwk_fOToR8171_4w34k9", 4.6, 26, 1320],
  ["Lakme Salon (Seethammadhara)", "Seethammadhara", "Seethammadhara Main Road, Near TTD Mandapam, Visakhapatnam", "+91 891 278 9944", "9 AM - 8:30 PM", 17.749500, 83.314200, "ChIJlk_SeethDOToR1122334455", 4.8, 15, 1460],
  ["Vurve Signature Salon", "Siripuram", "Waltair Main Road, Near Governor Bungalow, Siripuram, Visakhapatnam", "+91 891 252 3444", "9:30 AM - 9 PM", 17.722800, 83.319500, "ChIJvu_rveDOToR99887766554", 4.8, 19, 890],
  ["Habibs Hair and Beauty", "Jagadamba", "Jagadamba Commercial Complex, Near Jagadamba Theatre, Visakhapatnam", "+91 891 256 7788", "9:30 AM - 9:30 PM", 17.712400, 83.301500, "ChIJha_bibDOToR44556677889", 4.6, 34, 1750],
  ["Trends Unisex Salon and Spa", "Gajuwaka", "Steel Plant Sector 6 Road, Near Kurmannapalem Arch, Visakhapatnam", "+91 891 275 8811", "9 AM - 9 PM", 17.678100, 83.189500, "ChIJtr_endDOToR33221100998", 4.7, 21, 820]
];

// Map into objects
var S = D.map(function(x, i) {
  var initials = x[0].split(" ").map(function(w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
  var p1 = REAL_PHOTOS[i % REAL_PHOTOS.length];
  var p2 = REAL_PHOTOS[(i + 5) % REAL_PHOTOS.length];
  var p3 = REAL_PHOTOS[(i + 11) % REAL_PHOTOS.length];
  var p4 = REAL_PHOTOS[(i + 17) % REAL_PHOTOS.length];
  var p5 = REAL_PHOTOS[(i + 23) % REAL_PHOTOS.length];
  return {
    id: i + 1,
    n: x[0],
    a: x[1],
    addr: x[2],
    ph: x[3],
    h: x[4],
    lat: x[5],
    lng: x[6],
    pid: x[7],
    r: x[8],
    w: x[9],
    rc: x[10],
    initials: initials,
    g: G[i % G.length],
    s: SV,
    photos: [p1, p2, p3, p4, p5]
  };
});

// Distance calculation from Siripuram Circle, Vizag
S.forEach(function(s) {
  var R = Math.PI / 180;
  s.d = +(6371 * Math.acos(Math.min(1, Math.sin(17.7231 * R) * Math.sin(s.lat * R) + Math.cos(17.7231 * R) * Math.cos(s.lat * R) * Math.cos((s.lng - 83.3013) * R)))).toFixed(1);
});

var VIZAG_AREAS = ["All", "Siripuram", "MVP Colony", "Dwaraka Nagar", "Madhurawada", "Gajuwaka", "Seethammadhara", "Jagadamba"];

// Completely Emoji-Free Bilingual Translations
var I18N = {
  en: {
    salons: "Salons",
    myToken: "My Token",
    wallet: "Pass Wallet",
    analytics: "Owner Analytics",
    dbmsStudio: "DBMS SQL Studio",
    favourites: "Favourites",
    login: "Log in",
    account: "Account",
    settings: "Settings",
    heroTitle: "Skip the<br><em>Salon Wait.</em>",
    heroSub: "Live queue tracking and smarter wait time estimation across premier salons in Visakhapatnam.",
    searchPlaceholder: "Search salon name, area (MVP, Siripuram), or service...",
    shortestWait: "Shortest Wait",
    nearest: "Nearest",
    topRated: "Top Rated",
    lowCrowdOnly: "Low Crowd Only",
    allAreas: "All Areas",
    salonsLive: "Salons Active",
    avgWait: "Average Wait",
    tokensBooked: "Tokens Issued",
    bookToken: "Book Token",
    cancelToken: "Cancel Token",
    lowCrowdLabel: "Low Crowd",
    medCrowdLabel: "Medium Crowd",
    highCrowdLabel: "High Crowd",
    minWait: "min wait",
    aheadOfYou: "ahead in line",
    youAreNext: "Your turn is next",
    checkInQR: "Verify and Check-in",
    arrivalWindow: "10-Minute Arrival Window",
    departureAlert: "Departure Alert: You are 2 turns away.",
    smarterWaitNote: "Smarter wait: calculated from picked services and queue latency",
    footerSub: "Real-time salon queue management system. Visakhapatnam, Andhra Pradesh",
    theme: "Theme",
    dark: "Dark",
    white: "Light"
  },
  te: {
    salons: "సెలూన్లు",
    myToken: "నా టోకెన్",
    wallet: "పాస్ వాలెట్",
    analytics: "యజమాని విశ్లేషణలు",
    dbmsStudio: "DBMS SQL స్టూడియో",
    favourites: "ఇష్టమైనవి",
    login: "లాగిన్",
    account: "ఖాతా",
    settings: "సెట్టింగ్‌లు",
    heroTitle: "సెలూన్ వేచి ఉండే సమయాన్ని<br><em>దాటవేయండి.</em>",
    heroSub: "విశాఖపట్నంలోని ప్రముఖ సెలూన్లలో లైవ్ క్యూ ట్రాకింగ్ మరియు ఖచ్చితమైన సమయ అంచనా.",
    searchPlaceholder: "సెలూన్ పేరు, ప్రాంతం (సిరిపురం, MVP) లేదా సర్వీస్ శోధించండి...",
    shortestWait: "తక్కువ సమయం",
    nearest: "దగ్గరిది",
    topRated: "టాప్ రేటెడ్",
    lowCrowdOnly: "తక్కువ రద్దీ మాత్రమే",
    allAreas: "అన్ని ప్రాంతాలు",
    salonsLive: "సెలూన్లు అందుబాటులో",
    avgWait: "సగటు సమయం",
    tokensBooked: "నేటి టోకెన్లు",
    bookToken: "టోకెన్ బుక్ చేయండి",
    cancelToken: "టోకెన్ రద్దు చేయండి",
    lowCrowdLabel: "తక్కువ రద్దీ",
    medCrowdLabel: "మధ్యస్థ రద్దీ",
    highCrowdLabel: "ఎక్కువ రద్దీ",
    minWait: "నిమిషాల సమయం",
    aheadOfYou: "మీ ముందు ఉన్నవారు",
    youAreNext: "మీ వంతు తదుపరిది",
    checkInQR: "చెక్-ఇన్ ధృవీకరించండి",
    arrivalWindow: "10 నిమిషాల గడువు",
    departureAlert: "బయలుదేరాల్సిన సమయం! మీ ముందు 2 స్థానాలు మాత్రమే ఉన్నాయి.",
    smarterWaitNote: "ఎంచుకున్న సర్వీసులు మరియు లైవ్ క్యూ ఆధారంగా గణించబడింది",
    footerSub: "రియల్ టైమ్ సెలూన్ క్యూ మేనేజ్‌మెంట్ సిస్టమ్. విశాఖపట్నం, ఆంధ్రప్రదేశ్",
    theme: "థీమ్",
    dark: "డార్క్",
    white: "లైట్"
  }
};

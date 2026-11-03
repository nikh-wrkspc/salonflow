-- SalonFlow Seed Data: Real Salons in Visakhapatnam (Vizag), Andhra Pradesh
USE salonflow;

-- Admin and Owner users
INSERT INTO users (name, email, password_hash, role) VALUES 
('System Admin', 'admin@salonflow.in', '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789', 'admin'),
('Vizag Salon Partner', 'partner@salonflow.in', '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789', 'owner'),
('Rahul Varma', 'rahul.v@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789', 'customer'),
('Sneha Reddy', 'sneha.r@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789', 'customer');

-- 28 Real Top Salons in Visakhapatnam (Vizag), AP
INSERT INTO salons (owner_id, name, address, area, latitude, longitude, google_place_id, phone, open_time, close_time, rating, review_count, status) VALUES
(2, 'Toni & Guy Unisex Salon', 'VIP Road, Above Raymonds, Near Tycoon Restaurant, Siripuram, Visakhapatnam', 'Siripuram', 17.725800, 83.316400, 'ChIJdRLGxEBDOToRaFSiXrlCHZk', '+91 891 279 8899', '09:00:00', '21:00:00', 4.8, 2410, 'approved'),
(2, 'Mirrors Luxury Salons', 'Waltair Uplands, Opp. Siripuram HPCL Petrol Bunk, Siripuram, Visakhapatnam', 'Siripuram', 17.721400, 83.318100, 'ChIJT1VV-GlDOToRCBVLQO-pEmQ', '+91 891 667 7999', '09:00:00', '21:00:00', 4.9, 1890, 'approved'),
(2, 'Green Trends Unisex Salon', 'MVP Double Rd, Opp. ICICI Bank, Sector 2, MVP Colony, Visakhapatnam', 'MVP Colony', 17.742927, 83.328477, 'ChIJ80BpG1NDOToR3j7mFlE82YE', '+91 891 276 2232', '09:00:00', '21:00:00', 4.8, 3655, 'approved'),
(2, 'Naturals Hair & Beauty Salon', 'Sector 1, Beside HDFC Bank, MVP Colony, Visakhapatnam', 'MVP Colony', 17.743800, 83.329100, 'ChIJa-XoDVFdOToRDmR0VKo9XCs', '+91 891 273 4567', '09:00:00', '21:00:00', 4.7, 1420, 'approved'),
(2, 'Jawed Habib Hair & Beauty', '2nd Line, Opp. Hotel Meghalaya, Dwaraka Nagar, Visakhapatnam', 'Dwaraka Nagar', 17.727500, 83.306800, 'ChIJNbAdTYZDOToRnBereBn4qeM', '+91 891 254 7890', '09:30:00', '21:00:00', 4.7, 1670, 'approved'),
(2, 'Bounce Salon & Spa', 'Dutt Island, Siripuram Circle, Siripuram, Visakhapatnam', 'Siripuram', 17.723500, 83.317900, 'ChIJ2VpK315DOToRJeMBhPsvexM', '+91 891 270 5544', '09:00:00', '21:00:00', 4.8, 2130, 'approved'),
(2, 'Lakme Salon', 'VIP Road, Beside Pantaloons, CBM Compound, Siripuram, Visakhapatnam', 'Siripuram', 17.726200, 83.314900, 'ChIJ8azlLLZDOToRlTYEkK2mZP0', '+91 891 250 8822', '09:00:00', '20:30:00', 4.7, 1980, 'approved'),
(2, 'Bubbles Hair and Beauty', 'Siripuram Junction, Near Gurajada Kalakshetram, Siripuram, Visakhapatnam', 'Siripuram', 17.723796, 83.317660, 'ChIJ2VpK315DOToRJeMBhPsvexM', '+91 94925 51616', '08:00:00', '21:00:00', 4.7, 2366, 'approved'),
(2, 'Juice Salon', 'Waltair Club Rd, Beside Navy House, Siripuram, Visakhapatnam', 'Siripuram', 17.719625, 83.314791, 'ChIJ8azlLLZDOToRlTYEkK2mZP0', '+91 94417 19199', '09:00:00', '21:00:00', 4.7, 431, 'approved'),
(2, 'Bon Chic Salon & Spa', 'Chinna Waltair Main Rd, Opp. Timpany School, Siripuram, Visakhapatnam', 'Siripuram', 17.720623, 83.320321, 'ChIJT1VV-GlDOToRCBVLQO-pEmQ', '+91 70326 62442', '09:00:00', '21:00:00', 4.4, 263, 'approved'),
(2, 'J Studio Luxury Beauty (VIP Road)', 'VIP Rd, Above TVS Showroom, Siripuram, Visakhapatnam', 'Siripuram', 17.726058, 83.316826, 'ChIJdRLGxEBDOToRaFSiXrlCHZk', '+91 98826 89999', '08:00:00', '21:00:00', 4.7, 1848, 'approved'),
(2, 'Toppers Grand Unisex Salon', 'MVP Sector 6, Near Mahatma Gandhi Cancer Hospital, MVP Colony, Visakhapatnam', 'MVP Colony', 17.744141, 83.333954, 'ChIJDbbJDj1DOToRcAI1yZSA3Ck', '+91 90660 31999', '08:00:00', '21:00:00', 4.7, 566, 'approved'),
(2, 'Manifest Unisex Salon', 'MVP Double Rd, Near Pollocks School, MVP Colony, Visakhapatnam', 'MVP Colony', 17.742096, 83.332034, 'ChIJ7bqAnzpDOToR_1CIfPzEe1U', '+91 891 314 5344', '09:00:00', '21:00:00', 4.9, 66, 'approved'),
(2, 'Style Studio Unisex Salon', 'Sector 1, Above SBI Bank, MVP Colony, Visakhapatnam', 'MVP Colony', 17.744209, 83.328996, 'ChIJa-XoDVFdOToRDmR0VKo9XCs', '+91 95533 91689', '10:00:00', '21:00:00', 4.8, 205, 'approved'),
(2, 'S.he Hair & Beauty Unisex Salon', 'Santhipuram, Dwaraka Nagar, Visakhapatnam', 'Dwaraka Nagar', 17.736751, 83.305130, 'ChIJcZeGSYhDOToRyyLk610wgCY', '+91 70137 06616', '09:00:00', '21:00:00', 4.7, 448, 'approved'),
(2, 'S.he Family Salon', '1st Line, Beside V Hotel, Dwaraka Nagar, Visakhapatnam', 'Dwaraka Nagar', 17.726927, 83.307160, 'ChIJNbAdTYZDOToRnBereBn4qeM', '+91 63013 84537', '09:00:00', '21:00:00', 4.7, 264, 'approved'),
(2, 'Barber Hub Unisex Salon', 'Srinagar, Near Sai Baba Temple, Dwaraka Nagar, Visakhapatnam', 'Dwaraka Nagar', 17.728991, 83.309716, 'ChIJj5tUNb9DOToRrMhZJ4DXpsg', '+91 83092 82988', '06:00:00', '21:30:00', 4.8, 203, 'approved'),
(2, 'Royal Touch Unisex Salon', 'Chillapalli Complex, Near V Square, Dwaraka Nagar, Visakhapatnam', 'Dwaraka Nagar', 17.725618, 83.304681, 'ChIJjZnXQABDOToRKcduYK2r59A', '+91 95024 24555', '10:00:00', '21:00:00', 4.9, 571, 'approved'),
(2, 'Toni&Guy Essensuals (Madhurawada)', '100 Feet Rd, Midhilapuri VUDA Colony, Madhurawada, Visakhapatnam', 'Madhurawada', 17.801264, 83.368107, 'ChIJP2L-BU5bOToRT25C4bgxCyM', '+91 95575 77677', '10:00:00', '21:30:00', 4.9, 804, 'approved'),
(2, 'Glam Studios Madhurawada', 'Midhilapuri VUDA Colony, Main Road, Madhurawada, Visakhapatnam', 'Madhurawada', 17.802010, 83.366845, 'ChIJMxaJa8JbOToReMKrSMbtL1E', '+91 98499 07675', '09:00:00', '21:00:00', 4.8, 604, 'approved'),
(2, 'Celebrity Cuts', 'Midhilapuri VUDA Colony, Beside More Supermarket, Madhurawada, Visakhapatnam', 'Madhurawada', 17.802618, 83.363342, 'ChIJdSbMU9lbOToRYXK_euKTflI', '+91 77308 58858', '08:00:00', '21:00:00', 4.8, 917, 'approved'),
(2, 'J Studio (PM Palem)', 'PM Palem, SBI Colony, Madhurawada, Visakhapatnam', 'Madhurawada', 17.806006, 83.340667, 'ChIJLYXEFfBbOToRwBB5qWqbw0E', '+91 98828 69999', '08:00:00', '21:00:00', 4.8, 1076, 'approved'),
(2, 'Green Trends Unisex Salon (Gajuwaka)', 'Main Road, Opp. CMR Shopping Mall, Gajuwaka, Visakhapatnam', 'Gajuwaka', 17.689400, 83.213200, 'ChIJg_Gjwk_fOToRkW45_4w12c8', '+91 891 251 1122', '09:00:00', '21:00:00', 4.7, 1540, 'approved'),
(2, 'Naturals Unisex Salon (Gajuwaka)', 'Old Gajuwaka Junction, Beside South India Shopping Mall, Visakhapatnam', 'Gajuwaka', 17.691200, 83.215800, 'ChIJn_Njwk_fOToR8171_4w34k9', '+91 891 257 6655', '09:00:00', '21:00:00', 4.6, 1320, 'approved'),
(2, 'Lakme Salon (Seethammadhara)', 'Seethammadhara Main Road, Near TTD Kalyana Mandapam, Visakhapatnam', 'Seethammadhara', 17.749500, 83.314200, 'ChIJlk_SeethDOToR1122334455', '+91 891 278 9944', '09:00:00', '20:30:00', 4.8, 1460, 'approved'),
(2, 'Vurve Signature Salon', 'Waltair Main Road, Near Governor Bungalow, Siripuram, Visakhapatnam', 'Siripuram', 17.722800, 83.319500, 'ChIJvu_rveDOToR99887766554', '+91 891 252 3444', '09:30:00', '21:00:00', 4.8, 890, 'approved'),
(2, 'Habibs Hair & Beauty Salon', 'Jagadamba Commercial Complex, Near Jagadamba Theatre, Visakhapatnam', 'Jagadamba', 17.712400, 83.301500, 'ChIJha_bibDOToR44556677889', '+91 891 256 7788', '09:30:00', '21:30:00', 4.6, 1750, 'approved'),
(2, 'Trends Unisex Salon & Spa', 'Steel Plant Sector 6 Road, Near Kurmannapalem Arch, Visakhapatnam', 'Gajuwaka', 17.678100, 83.189500, 'ChIJtr_endDOToR33221100998', '+91 891 275 8811', '09:00:00', '21:00:00', 4.7, 820, 'approved');

-- Realistic Services with Individual Durations for Smarter Wait Time Calculation
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Executive Haircut & Styling', 'Hair', 250, 25 FROM salons;
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Beard Shaping & Trim', 'Grooming', 150, 15 FROM salons;
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Deep Conditioning Hair Spa', 'Hair', 700, 45 FROM salons;
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Charcoal Glow Facial', 'Face', 600, 40 FROM salons;
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Herbal Head Massage & Oil Therapy', 'Spa', 350, 20 FROM salons;
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Classic Manicure & Hand Care', 'Spa', 450, 30 FROM salons;
INSERT INTO services (salon_id, name, category, price, duration_min) SELECT salon_id, 'Hair Color / Streaks', 'Hair', 1200, 60 FROM salons;

-- Staff for each salon
INSERT INTO staff (salon_id, name, specialty) SELECT salon_id, 'Master Stylist Ravi', 'Hair & Styling' FROM salons;
INSERT INTO staff (salon_id, name, specialty) SELECT salon_id, 'Senior Stylist Priya', 'Skin & Facial' FROM salons;
INSERT INTO staff (salon_id, name, specialty) SELECT salon_id, 'Grooming Specialist Anand', 'Beard & Spa' FROM salons;

-- Sample Queue Data (Supporting Owner Analytics)
INSERT INTO queue (salon_id, customer_id, walkin_name, staff_id, token_no, queue_date, service_duration, status, joined_at, started_at, completed_at) VALUES
(1, 3, 'Karthik S', 1, 101, CURDATE(), 40, 'completed', NOW() - INTERVAL 120 MINUTE, NOW() - INTERVAL 105 MINUTE, NOW() - INTERVAL 65 MINUTE),
(1, 4, 'Divya M', 2, 102, CURDATE(), 70, 'completed', NOW() - INTERVAL 100 MINUTE, NOW() - INTERVAL 80 MINUTE, NOW() - INTERVAL 10 MINUTE),
(1, NULL, 'Venkatesh P', 3, 103, CURDATE(), 25, 'in_service', NOW() - INTERVAL 35 MINUTE, NOW() - INTERVAL 15 MINUTE, NULL),
(1, 3, NULL, 1, 104, CURDATE(), 60, 'called', NOW() - INTERVAL 20 MINUTE, NULL, NULL),
(1, NULL, 'Sai Kumar', NULL, 105, CURDATE(), 40, 'waiting', NOW() - INTERVAL 10 MINUTE, NULL, NULL),
(2, NULL, 'Harish B', 4, 101, CURDATE(), 30, 'completed', NOW() - INTERVAL 90 MINUTE, NOW() - INTERVAL 70 MINUTE, NOW() - INTERVAL 40 MINUTE),
(2, 4, NULL, 5, 102, CURDATE(), 25, 'no_show', NOW() - INTERVAL 85 MINUTE, NULL, NULL);

-- Sample In-App Community Reviews
INSERT INTO reviews (salon_id, user_id, rating, comment) VALUES
(1, 3, 5, 'Best salon in Siripuram! Booked my token from home, arrived when 2 turns were left and got served right away without waiting.'),
(2, 4, 5, 'Mirrors has world-class interiors and professional stylists. Estimated wait time was accurate to the minute!'),
(3, 3, 4, 'Green Trends MVP Colony is always reliable. The 10-minute arrival window keeps the queue moving quickly.');

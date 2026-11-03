-- SalonFlow: MySQL Schema (3NF)
-- Advanced Salon Queue & Waiting Time Management System
CREATE DATABASE IF NOT EXISTS salonflow;
USE salonflow;

-- 1. Users Table (Customers, Salon Owners, Administrators)
CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  phone         VARCHAR(15),
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer','owner','admin') NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Salons Table (Real Visakhapatnam, Andhra Pradesh locations)
CREATE TABLE salons (
  salon_id        INT AUTO_INCREMENT PRIMARY KEY,
  owner_id        INT NOT NULL,
  name            VARCHAR(120) NOT NULL,
  address         VARCHAR(255) NOT NULL,
  area            VARCHAR(80) NOT NULL,         -- e.g. MVP Colony, Siripuram, Dwaraka Nagar, Gajuwaka
  latitude        DECIMAL(9,6) NOT NULL,
  longitude       DECIMAL(9,6) NOT NULL,
  google_place_id VARCHAR(100),                 -- links to Google Places data
  phone           VARCHAR(20),
  open_time       TIME NOT NULL DEFAULT '09:00:00',
  close_time      TIME NOT NULL DEFAULT '21:00:00',
  rating          DECIMAL(2,1) DEFAULT 4.7,
  review_count    INT DEFAULT 150,
  status          ENUM('pending','approved','rejected','suspended') DEFAULT 'approved',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_area (area),
  INDEX idx_rating (rating)
);

-- 3. Services Table (Specific services with individual durations for smarter wait times)
CREATE TABLE services (
  service_id   INT AUTO_INCREMENT PRIMARY KEY,
  salon_id     INT NOT NULL,
  name         VARCHAR(100) NOT NULL,
  category     VARCHAR(50) DEFAULT 'General',   -- Hair, Face, Spa, Grooming
  price        DECIMAL(8,2) NOT NULL,
  duration_min INT NOT NULL,                    -- individual service duration in minutes
  is_active    BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (salon_id) REFERENCES salons(salon_id) ON DELETE CASCADE,
  INDEX idx_duration (duration_min)
);

-- 4. Staff Table
CREATE TABLE staff (
  staff_id     INT AUTO_INCREMENT PRIMARY KEY,
  salon_id     INT NOT NULL,
  name         VARCHAR(100) NOT NULL,
  specialty    VARCHAR(80) DEFAULT 'Senior Stylist',
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (salon_id) REFERENCES salons(salon_id) ON DELETE CASCADE
);

-- 5. Bookings Table
CREATE TABLE bookings (
  booking_id   INT AUTO_INCREMENT PRIMARY KEY,
  customer_id  INT NOT NULL,
  salon_id     INT NOT NULL,
  booking_date DATE NOT NULL,
  total_amount DECIMAL(8,2) DEFAULT 0,
  est_duration INT DEFAULT 30,                 -- total service duration picked
  status       ENUM('booked','checked_in','cancelled','completed','no_show') DEFAULT 'booked',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(user_id),
  FOREIGN KEY (salon_id)    REFERENCES salons(salon_id)
);

-- 6. Junction Table: Booking Services (M:N Relationship)
CREATE TABLE booking_services (
  booking_id INT NOT NULL,
  service_id INT NOT NULL,
  price      DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (booking_id, service_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- 7. Queue Table (Live tokens with automatic 10-minute no-show tracking)
CREATE TABLE queue (
  queue_id     INT AUTO_INCREMENT PRIMARY KEY,
  salon_id     INT NOT NULL,
  booking_id   INT NULL,                       -- NULL for walk-ins
  customer_id  INT NULL,
  walkin_name  VARCHAR(100) NULL,
  staff_id     INT NULL,
  token_no     INT NOT NULL,
  queue_date   DATE NOT NULL,
  service_duration INT DEFAULT 30,             -- sum of picked services
  status       ENUM('waiting','called','in_service','completed','cancelled','no_show') DEFAULT 'waiting',
  joined_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  called_at    TIMESTAMP NULL,                 -- timestamp when customer was called (turn 1)
  started_at   TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  qr_hash      VARCHAR(64) NULL,               -- token QR verification code
  UNIQUE KEY uq_token (salon_id, queue_date, token_no),
  FOREIGN KEY (salon_id)    REFERENCES salons(salon_id),
  FOREIGN KEY (booking_id)  REFERENCES bookings(booking_id),
  FOREIGN KEY (customer_id) REFERENCES users(user_id),
  FOREIGN KEY (staff_id)    REFERENCES staff(staff_id)
);

-- 8. Customer In-App Reviews Table (Ratings & feedback)
CREATE TABLE reviews (
  review_id   INT AUTO_INCREMENT PRIMARY KEY,
  salon_id    INT NOT NULL,
  user_id     INT NOT NULL,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (salon_id) REFERENCES salons(salon_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(user_id) ON DELETE CASCADE
);

-- 9. Customer Favourites Table
CREATE TABLE favourites (
  favourite_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  salon_id     INT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_salon (user_id, salon_id),
  FOREIGN KEY (user_id)  REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (salon_id) REFERENCES salons(salon_id) ON DELETE CASCADE
);

-- 10. Notifications Table (Supports 2-turns away departure alerts)
CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  message    VARCHAR(255) NOT NULL,
  type       ENUM('queue_alert','turn_near','no_show_warning','offer') DEFAULT 'queue_alert',
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =======================================================
-- DBMS VIEWS FOR REAL-TIME METRICS & OWNER ANALYTICS
-- =======================================================

-- View 1: Live Salon Crowd & Smarter Wait Times
-- Crowd: Low (<=15 min), Medium (16-35 min), High (>35 min)
CREATE OR REPLACE VIEW salon_wait_view AS
SELECT 
  s.salon_id, 
  s.name,
  s.area,
  (SELECT COUNT(*) FROM queue q
     WHERE q.salon_id = s.salon_id AND q.queue_date = CURDATE()
       AND q.status IN ('waiting','called','in_service')) AS customers_waiting,
  (SELECT GREATEST(COUNT(*),1) FROM staff st
     WHERE st.salon_id = s.salon_id AND st.is_available = TRUE) AS available_staff,
  (SELECT COALESCE(AVG(duration_min),25) FROM services sv
     WHERE sv.salon_id = s.salon_id AND sv.is_active = TRUE) AS avg_duration,
  ROUND(
    (SELECT COUNT(*) FROM queue q
       WHERE q.salon_id = s.salon_id AND q.queue_date = CURDATE()
         AND q.status IN ('waiting','called','in_service'))
    * (SELECT COALESCE(AVG(duration_min),25) FROM services sv
         WHERE sv.salon_id = s.salon_id AND sv.is_active = TRUE)
    / (SELECT GREATEST(COUNT(*),1) FROM staff st
         WHERE st.salon_id = s.salon_id AND st.is_available = TRUE)
  ) AS est_wait_min,
  CASE 
    WHEN ROUND(
      (SELECT COUNT(*) FROM queue q WHERE q.salon_id = s.salon_id AND q.queue_date = CURDATE() AND q.status IN ('waiting','called','in_service'))
      * (SELECT COALESCE(AVG(duration_min),25) FROM services sv WHERE sv.salon_id = s.salon_id AND sv.is_active = TRUE)
      / (SELECT GREATEST(COUNT(*),1) FROM staff st WHERE st.salon_id = s.salon_id AND st.is_available = TRUE)
    ) <= 15 THEN 'Low'
    WHEN ROUND(
      (SELECT COUNT(*) FROM queue q WHERE q.salon_id = s.salon_id AND q.queue_date = CURDATE() AND q.status IN ('waiting','called','in_service'))
      * (SELECT COALESCE(AVG(duration_min),25) FROM services sv WHERE sv.salon_id = s.salon_id AND sv.is_active = TRUE)
      / (SELECT GREATEST(COUNT(*),1) FROM staff st WHERE st.salon_id = s.salon_id AND st.is_available = TRUE)
    ) <= 35 THEN 'Medium'
    ELSE 'High'
  END AS crowd_label
FROM salons s
WHERE s.status = 'approved';

-- View 2: Owner Analytics - Customers Per Day (GROUP BY DATE)
CREATE OR REPLACE VIEW owner_daily_analytics_view AS
SELECT 
  salon_id,
  queue_date AS service_date,
  COUNT(*) AS total_customers,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_tokens,
  SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) AS no_shows,
  ROUND(AVG(service_duration), 1) AS avg_service_duration_min
FROM queue
GROUP BY salon_id, queue_date
ORDER BY queue_date DESC;

-- View 3: Owner Analytics - Peak Hours Distribution (GROUP BY HOUR)
CREATE OR REPLACE VIEW owner_hourly_rush_view AS
SELECT 
  salon_id,
  HOUR(joined_at) AS hour_of_day,
  COUNT(*) AS customer_count
FROM queue
GROUP BY salon_id, HOUR(joined_at)
ORDER BY customer_count DESC;

-- View 4: Owner Analytics - Top Requested Services (GROUP BY Service)
CREATE OR REPLACE VIEW owner_service_analytics_view AS
SELECT 
  s.salon_id,
  s.name AS service_name,
  s.category,
  COUNT(bs.booking_id) AS total_orders,
  SUM(bs.price) AS total_revenue
FROM services s
LEFT JOIN booking_services bs ON s.service_id = bs.service_id
GROUP BY s.salon_id, s.service_id, s.name, s.category
ORDER BY total_orders DESC;

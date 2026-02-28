CREATE TABLE IF NOT EXISTS flight_offers (
  id VARCHAR(64) PRIMARY KEY,
  origin VARCHAR(8) NOT NULL,
  destination VARCHAR(8) NOT NULL,
  seat_class VARCHAR(16) NOT NULL DEFAULT 'economy',
  recommendation_tag VARCHAR(64) NULL,
  outbound_depart_time VARCHAR(8) NOT NULL,
  outbound_arrive_time VARCHAR(8) NOT NULL,
  outbound_airline VARCHAR(64) NOT NULL,
  outbound_duration_text VARCHAR(32) NOT NULL,
  inbound_depart_time VARCHAR(8) NOT NULL,
  inbound_arrive_time VARCHAR(8) NOT NULL,
  inbound_airline VARCHAR(64) NOT NULL,
  inbound_duration_text VARCHAR(32) NOT NULL,
  seats_left INT NOT NULL,
  price_krw INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flight_bookings (
  booking_id VARCHAR(64) PRIMARY KEY,
  flight_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accommodations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(128) NOT NULL,
  district VARCHAR(128) NOT NULL,
  subtitle VARCHAR(512) NOT NULL,
  tags_json TEXT NOT NULL,
  star_rating INT NOT NULL,
  review_score DECIMAL(3,2) NOT NULL,
  review_count INT NOT NULL,
  saved_count INT NOT NULL,
  price_krw INT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  description TEXT NOT NULL,
  amenities_json TEXT NOT NULL,
  images_json TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accommodation_bookings (
  booking_id VARCHAR(64) PRIMARY KEY,
  accommodation_id VARCHAR(64) NOT NULL,
  guest_name VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

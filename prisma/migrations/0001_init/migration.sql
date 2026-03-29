-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Agents (real estate agents who list properties)
CREATE TABLE agents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  agency_name   TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Property listings
CREATE TABLE listings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id          UUID NOT NULL REFERENCES agents(id),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT NOT NULL,
  property_type     TEXT NOT NULL CHECK (property_type IN ('house','apartment','condo','townhouse','land')),
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','sold','draft')),
  price_cents       BIGINT NOT NULL,
  bedrooms          INTEGER,
  bathrooms         NUMERIC(3,1),
  area_sqft         INTEGER,
  address           TEXT NOT NULL,
  city              TEXT NOT NULL,
  state             TEXT NOT NULL,
  zip               TEXT NOT NULL,
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  virtual_tour_url  TEXT,
  year_built        INTEGER,
  amenities         JSONB DEFAULT '[]',
  search_vector     TSVECTOR,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Property photos
CREATE TABLE listing_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Contact / lead inquiries
CREATE TABLE inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id),
  agent_id    UUID NOT NULL REFERENCES agents(id),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(price_cents);
CREATE INDEX idx_listings_agent ON listings(agent_id);
CREATE INDEX idx_listings_search ON listings USING GIN(search_vector);

-- Auto-update search vector trigger
CREATE FUNCTION update_listing_search() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.city, '') || ' ' ||
    coalesce(NEW.address, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_search_update
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_listing_search();

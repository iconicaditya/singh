CREATE TABLE IF NOT EXISTS research (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  tags TEXT,
  title_image TEXT,
  authors JSONB NOT NULL,
  content_sections JSONB NOT NULL,
  related_publications JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
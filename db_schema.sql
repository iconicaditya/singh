-- Research Table Schema
CREATE TABLE IF NOT EXISTS research (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year VARCHAR(4) NOT NULL,
    tags TEXT,
    title_image TEXT,
    authors JSONB NOT NULL,            -- Array of objects: { "name": string, "image": string }
    content_sections JSONB NOT NULL,   -- Array of objects: { "title": string, "content": string, "image": string }
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table Schema
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT,
    team_members JSONB,
    location VARCHAR(255),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    image_url TEXT,
    about_project TEXT,
    project_objectives JSONB,
    project_date VARCHAR(100),
    attached_research_ids JSONB,
    link TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Publications Table Schema
CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    authors TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    pdf_url TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gallery Table Schema
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
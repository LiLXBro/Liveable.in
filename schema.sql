-- Enable UUID extension (optional but good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'editor', 'champion', 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Champions Table (Profile)
CREATE TABLE IF NOT EXISTS champions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(20),
    target_state VARCHAR(100),
    profile_image TEXT, -- Stores Base64 string or URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT, -- Stores Base64 string or URL
    location_ward VARCHAR(100),
    location_block VARCHAR(100),
    location_district VARCHAR(100),
    location_state VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, correction_needed
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    guest_name VARCHAR(100), -- Legacy support, can be nullable
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Votes Table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote_value INTEGER NOT NULL CHECK (vote_value IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blog_id, user_id)
);

-- 6. Insert Default Admin (Password: admin123)
-- Note: You should change this password immediately after login.
-- The hash below is for 'admin123'
INSERT INTO users (email, password_hash, role)
VALUES ('admin@clic.org', '$2b$10$YourGeneratedHashHereOrUseNodeScript', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Since hashing in SQL is hard without pgcrypto, we will rely on the app to seed the admin 
-- or you can run the seed-admin.js script after creating tables.

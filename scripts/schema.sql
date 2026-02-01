-- Existing Champions Table (Modified to link to users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'champion', -- 'champion', 'editor', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS champions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL, 
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    target_state VARCHAR(100) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    location_ward VARCHAR(100),
    location_block VARCHAR(100),
    location_district VARCHAR(100),
    location_state VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'correction_needed'
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL, -- Null if guest
    guest_name VARCHAR(100), -- Used if user_id is null
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    vote_value INT NOT NULL, -- 1 for upvote, -1 for downvote
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blog_id, user_id)
);

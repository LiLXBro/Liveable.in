const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function main() {
    console.log('Migrating database...');
    try {
        await pool.query('BEGIN');

        // Add user_id to champions if missing
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='champions' AND column_name='user_id') THEN 
                    ALTER TABLE champions ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE; 
                END IF; 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='champions' AND column_name='profile_image') THEN 
                    ALTER TABLE champions ADD COLUMN profile_image TEXT; 
                END IF;
            END $$;
        `);

        // Check if votes table exists, if not create
        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id SERIAL PRIMARY KEY,
                blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                vote_value INTEGER NOT NULL CHECK (vote_value IN (-1, 1)),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(blog_id, user_id)
            );
        `);

        // Check if blogs table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image_url TEXT,
                location_ward VARCHAR(100),
                location_block VARCHAR(100),
                location_district VARCHAR(100),
                location_state VARCHAR(100),
                status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, correction_needed
                upvotes INTEGER DEFAULT 0,
                downvotes INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check if comments table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                guest_name VARCHAR(100),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query('COMMIT');
        console.log('Migration successful.');
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

main();

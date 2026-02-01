const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function main() {
    try {
        console.log('Seeding admin user...');

        const email = 'admin@liveable.in';
        const password = 'admin'; // Simple password for demo
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if exists
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            console.log('Admin already exists.');
            return;
        }

        await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
            [email, hashedPassword, 'admin']
        );

        console.log(`Admin created: ${email} / ${password}`);
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        await pool.end();
    }
}

main();

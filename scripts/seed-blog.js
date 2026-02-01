const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function main() {
    console.log('Seeding Sample Blog...');

    try {
        // 1. Ensure Champion User exists
        const email = 'champion_test@liveable.in';
        const password = 'champion';
        const hashedPassword = await bcrypt.hash(password, 10);

        let userId;

        const checkUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            userId = checkUser.rows[0].id;
            console.log('Test Champion already exists.');
        } else {
            const userRes = await pool.query(
                'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
                [email, hashedPassword, 'champion']
            );
            userId = userRes.rows[0].id;
            // Link champion profile
            await pool.query(`
                INSERT INTO champions (user_id, first_name, last_name, email, phone, address, city, state, pin_code, target_state)
                VALUES ($1, 'Test', 'Champion', $2, '9999999999', '123 Green St', 'Gangtok', 'Sikkim', '737101', 'Sikkim')
            `, [userId, email]);
            console.log('Created Test Champion.');
        }

        // 2. Create Blog
        const blogTitle = 'Transforming Gangtok into a Sustainable Hub';
        const blogCheck = await pool.query('SELECT id FROM blogs WHERE title = $1', [blogTitle]);

        if (blogCheck.rows.length === 0) {
            await pool.query(`
                INSERT INTO blogs 
                (user_id, title, content, image_url, location_ward, location_block, location_district, location_state, status, upvotes, downvotes, created_at)
                VALUES 
                ($1, $2, $3, $4, 'Ward 1', 'East Block', 'Gangtok', 'Sikkim', 'approved', 15, 2, NOW())
            `, [
                userId,
                blogTitle,
                'We have implemented a new waste management system in our ward that separates organic and plastic waste at the source. This has reduced landfill contributions by 40% in just two months! The community participation has been overwhelming, with children leading the awareness drives. Our next step is to install solar street lights in the market area.',
                'https://images.unsplash.com/photo-1542601906990-24d4c16419d9?q=80&w=1000&auto=format&fit=crop', // Stock nature/city image
            ]);
            console.log('Created Sample Blog.');
        } else {
            console.log('Sample Blog already exists.');
        }

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

main();

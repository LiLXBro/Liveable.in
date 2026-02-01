'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

// --- Authentication ---

export async function login(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = res.rows[0];

            if (!user || !(await verifyPassword(password, user.password_hash))) {
                return { message: 'Invalid credentials', success: false };
            }

            // Set session cookie (JWT)
            const token = signToken({ userId: user.id, role: user.role });
            cookies().set('session_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });

            // Cleanup old cookies if any
            cookies().delete('user_id');
            cookies().delete('user_role');

            return { message: 'Login successful', success: true, role: user.role };
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Login Error:', error);
        return { message: 'Login failed', success: false };
    }
}

export async function logout() {
    cookies().delete('user_id'); // legacy
    cookies().delete('user_role'); // legacy
    cookies().delete('session_token');
    redirect('/');
}

export async function getSession() {
    const token = cookies().get('session_token')?.value;

    // Fallback for immediate transition (optional, but requested to implement JWT, so prioritizing JWT)
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            return { userId: decoded.userId, userRole: decoded.role };
        }
    }

    // Legacy fallback (can be removed later)
    const userId = cookies().get('user_id')?.value;
    const userRole = cookies().get('user_role')?.value;
    return userId ? { userId, userRole } : null;
}

export async function getHeaderUser() {
    const session = await getSession();
    if (!session) return null;

    try {
        const client = await pool.connect();
        try {
            // Try to get detailed info from champions table first (for name/image)
            const championRes = await client.query('SELECT email, profile_image FROM champions WHERE user_id = $1', [session.userId]);
            if (championRes.rows.length > 0) {
                return { ...session, ...championRes.rows[0] };
            }

            // If not champion (e.g. basic admin/user without champion profile?), fetch email from users
            // Admin usually doesn't have a champion profile in this schema unless we unified it.
            // Let's just fetch email from users table.
            const userRes = await client.query('SELECT email FROM users WHERE id = $1', [session.userId]);
            return { ...session, ...userRes.rows[0] };
        } finally {
            client.release();
        }
    } catch (e) {
        return session; // Fallback to just session info
    }
}

// --- Champion Registration ---

export async function submitChampion(prevState, formData) {
    const data = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pin_code: formData.get('pin_code'),
        target_state: formData.get('target_state'),
    };

    for (const [key, value] of Object.entries(data)) {
        if (!value || value.toString().trim() === '') {
            return { message: `Field ${key} is required`, success: false };
        }
    }

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Create User
            const hashedPassword = await hashPassword(data.password);
            const userRes = await client.query(
                'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
                [data.email, hashedPassword, 'champion']
            );
            const userId = userRes.rows[0].id;

            // 2. Create Champion
            await client.query(`
                INSERT INTO champions 
                (user_id, first_name, last_name, email, phone, address, city, state, pin_code, target_state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [userId, data.first_name, data.last_name, data.email, data.phone, data.address, data.city, data.state, data.pin_code, data.target_state]);

            await client.query('COMMIT');

            // Auto login with JWT
            const token = signToken({ userId: userId, role: 'champion' });
            cookies().set('session_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        revalidatePath('/');
        return { message: 'Registration successful!', success: true };
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.code === '23505') {
            return { message: 'Email already exists.', success: false };
        }
        return { message: 'Registration failed.', success: false };
    }
}

export async function getChampions() {
    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT id, city, state, target_state FROM champions');
            return res.rows;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

// --- Blog Actions ---

export async function createBlog(prevState, formData) {
    const session = await getSession();
    if (!session) return { message: 'Unauthorized', success: false };

    const title = formData.get('title');
    const content = formData.get('content');
    const imageFile = formData.get('image_url'); // We'll keep the name 'image_url' for compatibility but it will handle file object now

    // Handle file upload
    let imageUrl = null;
    if (imageFile instanceof File && imageFile.size > 0) {
        imageUrl = await saveFile(imageFile);
    } else if (typeof imageFile === 'string') {
        imageUrl = imageFile; // Allow legacy URL string if passed (though we are switching to file)
    }

    const ward = formData.get('ward');
    const block = formData.get('block');
    const district = formData.get('district');
    const state = formData.get('state');

    // Auto-approve for admins and editors
    const status = ['admin', 'editor'].includes(session.userRole) ? 'approved' : 'pending';

    try {
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO blogs (user_id, title, content, image_url, location_ward, location_block, location_district, location_state, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [session.userId, title, content, imageUrl, ward, block, district, state, status]);
        } finally {
            client.release();
        }

        if (['admin', 'editor'].includes(session.userRole)) {
            revalidatePath('/dashboard/admin');
            revalidatePath('/dashboard/editor');
            revalidatePath('/');
        } else {
            revalidatePath('/dashboard/champion');
        }

        return { message: ['admin', 'editor'].includes(session.userRole) ? 'Blog published directly!' : 'Blog submitted for review', success: true };
    } catch (error) {
        console.error('Create Blog Error:', error);
        return { message: 'Failed to create blog', success: false };
    }
}

export async function getBlogs(status = 'approved') {
    try {
        const client = await pool.connect();
        try {
            const query = `
                SELECT b.*, u.email as author_email, 
                       (SELECT first_name || ' ' || last_name FROM champions WHERE user_id = b.user_id) as author_name
                FROM blogs b
                JOIN users u ON b.user_id = u.id
                WHERE b.status = $1
                ORDER BY (b.upvotes - b.downvotes) DESC, b.created_at DESC
            `;
            const res = await client.query(query, [status]);
            return res.rows;
        } finally {
            client.release();
        }
    } catch (error) {
        return [];
    }
}


export async function getBlogById(id) {
    try {
        const client = await pool.connect();
        try {
            // Get Blog
            const blogRes = await client.query(`
                SELECT b.*, 
                       (SELECT first_name || ' ' || last_name FROM champions WHERE user_id = b.user_id) as author_name
                FROM blogs b
                WHERE b.id = $1
            `, [id]);

            if (blogRes.rows.length === 0) return null;
            const blog = blogRes.rows[0];

            // Get Comments
            const commentsRes = await client.query(`
                SELECT c.*, 
                       COALESCE((SELECT first_name || ' ' || last_name FROM champions WHERE user_id = c.user_id), c.guest_name) as author_name
                FROM comments c
                WHERE c.blog_id = $1
                ORDER BY c.created_at DESC
            `, [id]);

            return { ...blog, comments: commentsRes.rows };
        } finally {
            client.release();
        }
    } catch (error) {
        return null;
    }
}

export async function voteBlog(blogId, voteValue) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Upsert vote
            await client.query(`
                INSERT INTO votes (blog_id, user_id, vote_value)
                VALUES ($1, $2, $3)
                ON CONFLICT (blog_id, user_id) 
                DO UPDATE SET vote_value = EXCLUDED.vote_value
            `, [blogId, session.userId, voteValue]);

            // Update blog counts (simplified for MVP, ideally triggers or separate count query)
            // Recalculate totals
            await client.query(`
                UPDATE blogs 
                SET upvotes = (SELECT COUNT(*) FROM votes WHERE blog_id = $1 AND vote_value = 1),
                    downvotes = (SELECT COUNT(*) FROM votes WHERE blog_id = $1 AND vote_value = -1)
                WHERE id = $1
            `, [blogId]);

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        revalidatePath(`/blog/${blogId}`);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function commentOnBlog(blogId, content) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const userId = session.userId;

    try {
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO comments (blog_id, user_id, content)
                VALUES ($1, $2, $3)
            `, [blogId, userId, content]);
        } finally {
            client.release();
        }
        revalidatePath(`/blog/${blogId}`);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function updateBlogStatus(blogId, status) {
    const session = await getSession();
    // Basic check, real app would check DB for admin/editor role
    if (!session || !['admin', 'editor'].includes(session.userRole)) return { success: false };

    try {
        const client = await pool.connect();
        try {
            await client.query('UPDATE blogs SET status = $1 WHERE id = $2', [status, blogId]);
        } finally {
            client.release();
        }
        revalidatePath('/dashboard/editor');
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// --- Admin Actions ---

export async function createEditor(prevState, formData) {
    const session = await getSession();
    if (!session || session.userRole !== 'admin') return { success: false, message: 'Unauthorized' };

    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const phone = formData.get('phone');

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if user exists
            const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            if (userCheck.rows.length > 0) {
                await client.query('ROLLBACK');
                return { success: false, message: 'Email already exists' };
            }

            const hashedPassword = await hashPassword(password);

            // 1. Create User
            const userRes = await client.query(
                'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
                [email, hashedPassword, 'editor']
            );
            const userId = userRes.rows[0].id;

            // 2. Create Champion (Editor Profile)
            // Splitting name safely
            const [firstName, ...lastNameParts] = name.split(' ');
            const lastName = lastNameParts.join(' ') || '';

            await client.query(`
                INSERT INTO champions (user_id, first_name, last_name, email, phone, address, city, state, pin_code, target_state)
                VALUES ($1, $2, $3, $4, $5, 'Editor Office', 'City', 'State', '000000', 'All')
            `, [userId, firstName, lastName, email, phone]);

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        revalidatePath('/dashboard/admin');
        return { success: true, message: 'Editor created successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to create editor' };
    }
}

export async function getAdminStats() {
    try {
        const client = await pool.connect();
        try {
            // Blogs by State
            const stateRes = await client.query(`
                SELECT location_state, COUNT(*) as count 
                FROM blogs 
                WHERE status = 'approved' 
                GROUP BY location_state
            `);

            // Total Users
            const userRes = await client.query(`
                SELECT role, COUNT(*) as count FROM users GROUP BY role
            `);

            // Activity (Blogs per day - simplified for last 7 days)
            const activityRes = await client.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count 
                FROM blogs 
                WHERE created_at > NOW() - INTERVAL '7 days' 
                GROUP BY DATE(created_at) 
                ORDER BY DATE(created_at)
            `);

            return {
                blogsByState: stateRes.rows,
                usersByRole: userRes.rows,
                recentActivity: activityRes.rows
            };
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Stats Error:', error);
        return { blogsByState: [], usersByRole: [], recentActivity: [] };
    }
}

export async function deleteUser(email) {
    // Admin only check ideally
    try {
        const client = await pool.connect();
        try {
            await client.query('DELETE FROM users WHERE email = $1', [email]);
        } finally {
            client.release();
        }
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function updateProfile(formData) {
    const session = await getSession();
    if (!session) redirect('/login');

    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const phone = formData.get('phone');
    const address = formData.get('address');

    // Handle image upload
    const imageFile = formData.get('profile_image');
    let profileImage = null;

    if (imageFile instanceof File && imageFile.size > 0) {
        profileImage = await saveFile(imageFile);
    } else if (typeof imageFile === 'string' && imageFile.length > 0) {
        profileImage = imageFile;
    }

    try {
        const client = await pool.connect();
        try {
            // Check if champion record exists
            const checkRes = await client.query('SELECT id FROM champions WHERE user_id = $1', [session.userId]);

            if (checkRes.rows.length === 0) {
                // Insert if not exists (migrating old user)
                await client.query(`
                    INSERT INTO champions (user_id, first_name, last_name, phone, address, profile_image, email)
                    VALUES ($1, $2, $3, $4, $5, $6, (SELECT email FROM users WHERE id = $1))
                `, [session.userId, firstName, lastName, phone, address, profileImage]);
            } else {
                // Update
                if (profileImage) {
                    await client.query(`
                        UPDATE champions 
                        SET first_name = $1, last_name = $2, phone = $3, address = $4, profile_image = $5
                        WHERE user_id = $6
                    `, [firstName, lastName, phone, address, profileImage, session.userId]);
                } else {
                    await client.query(`
                        UPDATE champions 
                        SET first_name = $1, last_name = $2, phone = $3, address = $4
                        WHERE user_id = $5
                    `, [firstName, lastName, phone, address, session.userId]);
                }
            }
        } finally {
            client.release();
        }
        revalidatePath('/profile/edit');
        revalidatePath('/'); // Update header
        return { success: true };
    } catch (error) {
        console.error('Update Profile Error:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

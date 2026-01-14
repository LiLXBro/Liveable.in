'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitChampion(prevState, formData) {
    // Extract data
    const data = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pin_code: formData.get('pin_code'),
        target_state: formData.get('target_state'),
    };

    // Validate presence (Basic validation, detailed validation can be added with Zod)
    for (const [key, value] of Object.entries(data)) {
        if (!value || value.toString().trim() === '') {
            return { message: `Field ${key} is required`, success: false };
        }
    }

    try {
        const client = await pool.connect();
        try {
            const query = `
        INSERT INTO champions 
        (first_name, last_name, email, phone, address, city, state, pin_code, target_state)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
        `;
            const values = [
                data.first_name, data.last_name, data.email, data.phone,
                data.address, data.city, data.state, data.pin_code, data.target_state
            ];

            await client.query(query, values);
        } finally {
            client.release();
        }

        revalidatePath('/');
        return { message: 'Registration successful! You are now a Champion.', success: true };
    } catch (error) {
        console.error('Database Error:', error);
        if (error.code === '23505') { // Unique violation
            return { message: 'This email is already registered.', success: false };
        }
        return { message: 'Failed to register. Please try again.', success: false };
    }
}

export async function getChampions() {
    try {
        const client = await pool.connect();
        try {
            // In a real app with geocoding, we'd return lat/lng. 
            // For now, we'll return city/state/id to map them.
            // If we strictly need lat/lng, we would need a geocoding step or pre-defined city usage.
            // We will assume the map component handles simple city-based distribution or mock coords for the MVP if geocoding isn't ready.
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

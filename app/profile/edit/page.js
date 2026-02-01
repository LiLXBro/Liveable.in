import { getHeaderUser, updateProfile } from "@/app/actions";
import { redirect } from "next/navigation";
import { Save, Loader2 } from 'lucide-react';

export default async function EditProfilePage() {
    const user = await getHeaderUser();

    if (!user) {
        redirect('/login');
    }

    // We need to fetch full profile details (phone, address, etc.)
    // Assuming getHeaderUser might not return everything, we might need a specific getFullProfile action
    // But for MVP, let's reuse or assume getHeaderUser can be expanded or we fetch here.
    // Let's create a specialized action for this page to fetch everything.

    // Actually, let's implement the UI and the action will handle the fetch internally or pass data?
    // Best practice generally to fetch in component.

    // For now, I'll use a new action `getFullProfile` to get editable fields.
    const profile = await getFullProfile(user.userId);

    async function handleUpdate(formData) {
        'use server';
        await updateProfile(formData);
        redirect('/profile/edit?success=true');
    }

    return (
        <main className="min-h-screen py-24 px-4 bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit Profile</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <form action={handleUpdate} className="space-y-6">
                        {/* Profile Image URL Input (Simulated Upload) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Profile Picture URL
                            </label>
                            <div className="flex gap-4 items-center">
                                {profile?.profile_image && (
                                    <img src={profile.profile_image} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                                )}
                                <input
                                    name="profile_image"
                                    defaultValue={profile?.profile_image || ''}
                                    className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                                    placeholder="https://example.com/my-photo.jpg"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Paste a direct image link (e.g. from Unsplash or Imgur) for now.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                <input
                                    name="first_name"
                                    defaultValue={profile?.first_name || ''}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                <input
                                    name="last_name"
                                    defaultValue={profile?.last_name || ''}
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                            <input
                                name="phone"
                                defaultValue={profile?.phone || ''}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                            <textarea
                                name="address"
                                defaultValue={profile?.address || ''}
                                rows="3"
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors w-full justify-center">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

// Keeping this simple helper here or move to actions
import { getSession } from "@/app/actions";
import pool from "@/lib/db";

async function getFullProfile(userId) {
    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM champions WHERE user_id = $1', [userId]);
            return res.rows[0] || {};
        } finally {
            client.release();
        }
    } catch (e) {
        return {};
    }
}

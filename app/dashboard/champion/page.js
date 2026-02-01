import { createBlog, getBlogs, getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { PlusCircle, Loader2 } from 'lucide-react';

export default async function ChampionDashboard() {
    const session = await getSession();
    if (!session || session.userRole !== 'champion') {
        // middleware would be better, but this works for MVP
        redirect('/login');
    }

    // In a real app we'd filter getBlogs by user_id, 
    // but current getBlogs returns all approved. 
    // We need a specific getMyBlogs action or filter. 
    // For now, let's just implement the submission form mainly.
    // I'll add a 'getMyBlogs' equivalent query or just show the form.

    // Actually, let's just make the user able to see their status. 
    // I'll make a quick client component for the form to handle state better.

    return (
        <main className="min-h-screen py-24 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Champion Dashboard</h1>
                        <p className="text-slate-500">Share your stories and impact.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Submission Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <PlusCircle size={20} /> New Story
                            </h2>
                            <form action={createBlog} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                                    <input name="title" required className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="e.g., Cleaned up Ward 4 Park" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">State</label>
                                        <input name="state" required className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="State" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">District</label>
                                        <input name="district" required className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="District" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Block</label>
                                        <input name="block" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="Block" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Ward</label>
                                        <input name="ward" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="Ward" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Upload Photo</label>
                                    <input name="image_url" type="file" accept="image/*" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Story</label>
                                    <textarea name="content" required rows="4" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="Describe your impact..." />
                                </div>
                                <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Submit for Review
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Status List (Placeholder for now as we didn't make a specific getMyBlogs) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex items-center justify-center text-slate-400">
                            <p>Your submitted stories will appear here.</p>
                            {/* TODO: Implement fetching user specific blogs */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

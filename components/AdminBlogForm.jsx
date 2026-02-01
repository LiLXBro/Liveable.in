'use client';

import { createBlog } from "@/app/actions";
import { PlusCircle, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            {pending ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
            {pending ? 'Publishing...' : 'Publish Blog'}
        </button>
    );
}

export default function AdminBlogForm() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlusCircle size={20} /> Write New Blog
            </h2>
            <form action={createBlog} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                    <input name="title" required className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="e.g., Policy Update: New Green Zones" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">State</label>
                        <input name="state" required className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="State (e.g., Delhi)" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">District/City</label>
                        <input name="district" required className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="District" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Block</label>
                        <input name="block" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="Block (Optional)" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Ward</label>
                        <input name="ward" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="Ward (Optional)" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Cover Image</label>
                    <input name="image_url" type="file" accept="image/*" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Content</label>
                    <textarea name="content" required rows="6" className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500" placeholder="Write your blog content here..." />
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}

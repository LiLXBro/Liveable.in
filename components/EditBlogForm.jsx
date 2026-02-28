'use client';

import { updateBlog } from "@/app/actions";
import { Save, Loader2 } from 'lucide-react';
import { useFormStatus, useFormState } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

export default function EditBlogForm({ blog }) {
    const [state, formAction] = useFormState(updateBlog, null);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {state?.message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {state.message}
                </div>
            )}
            <form action={formAction} className="space-y-4">
                {/* Hidden field carrying the blog ID */}
                <input type="hidden" name="blog_id" value={blog.id} />

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                    <input
                        name="title"
                        required
                        defaultValue={blog.title}
                        className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                        placeholder="e.g., Policy Update: New Green Zones"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">State</label>
                        <input
                            name="state"
                            required
                            defaultValue={blog.location_state}
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                            placeholder="State (e.g., Delhi)"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">District/City</label>
                        <input
                            name="district"
                            required
                            defaultValue={blog.location_district}
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                            placeholder="District"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Block</label>
                        <input
                            name="block"
                            defaultValue={blog.location_block || ''}
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                            placeholder="Block (Optional)"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Ward</label>
                        <input
                            name="ward"
                            defaultValue={blog.location_ward || ''}
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                            placeholder="Ward (Optional)"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Cover Image <span className="text-slate-400">(leave empty to keep existing)</span>
                    </label>
                    {blog.image_url && (
                        <p className="text-xs text-slate-400 mb-1">Current: {blog.image_url}</p>
                    )}
                    <input
                        name="image_url"
                        type="file"
                        accept="image/*"
                        className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Content</label>
                    <textarea
                        name="content"
                        required
                        rows="10"
                        defaultValue={blog.content}
                        className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-blue-500"
                        placeholder="Write your blog content here..."
                    />
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}

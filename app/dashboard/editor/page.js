import { getBlogs, updateBlogStatus, getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import AdminBlogForm from "@/components/AdminBlogForm";

export default async function EditorialDashboard() {
    const session = await getSession();
    if (!session || !['admin', 'editor'].includes(session.userRole)) {
        redirect('/login');
    }

    const pendingBlogs = await getBlogs('pending');

    async function handleReview(formData) {
        'use server';
        const blogId = formData.get('blogId');
        const status = formData.get('status');
        await updateBlogStatus(blogId, status);
    }

    return (
        <main className="min-h-screen py-24 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Editorial Dashboard</h1>
                </div>

                <div className="mb-12">
                    {/* Editor can also write blogs */}
                    <AdminBlogForm />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-slate-800">Pending Submissions ({pendingBlogs.length})</h2>
                    </div>

                    {pendingBlogs.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No pending blogs to review.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Author</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendingBlogs.map(blog => (
                                        <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <Link href={`/blog/${blog.id}`} className="font-semibold text-slate-800 hover:text-blue-600 block mb-1">
                                                    {blog.title}
                                                </Link>
                                                <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{blog.content}</p>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">{blog.author_name}</td>
                                            <td className="p-4 text-sm text-slate-600">{blog.location_city}, {blog.location_state}</td>
                                            <td className="p-4 text-sm text-slate-600">{new Date(blog.created_at).toLocaleDateString('en-GB')}</td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <form action={handleReview}>
                                                    <input type="hidden" name="blogId" value={blog.id} />
                                                    <input type="hidden" name="status" value="approved" />
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                </form>
                                                <form action={handleReview}>
                                                    <input type="hidden" name="blogId" value={blog.id} />
                                                    <input type="hidden" name="status" value="correction_needed" />
                                                    <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Request Edit">
                                                        <Edit size={20} />
                                                    </button>
                                                </form>
                                                <form action={handleReview}>
                                                    <input type="hidden" name="blogId" value={blog.id} />
                                                    <input type="hidden" name="status" value="rejected" />
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                        <XCircle size={20} />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

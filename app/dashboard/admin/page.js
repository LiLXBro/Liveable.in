import { getAdminStats, getBlogs, deleteUser, getSession, createEditor } from "@/app/actions";
import { redirect } from "next/navigation";
import { BlogsByStateChart, UserDistributionChart, ActivityChart } from "@/components/AdminCharts";
import { Trash2, Shield } from 'lucide-react';
import AddEditorForm from "@/components/AddEditorForm";
import AdminBlogForm from "@/components/AdminBlogForm";

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session || session.userRole !== 'admin') {
        redirect('/login');
    }

    const stats = await getAdminStats();
    const allBlogs = await getBlogs('approved');

    async function handleDeleteUser(formData) {
        'use server';
        await deleteUser(formData.get('email'));
    }

    return (
        <main className="min-h-screen py-24 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Editor Management */}
                    <AddEditorForm />

                    {/* Blog Creation */}
                    <AdminBlogForm />
                </div>

                {/* Analytics Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <BlogsByStateChart data={stats.blogsByState} />
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <UserDistributionChart data={stats.usersByRole} />
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <ActivityChart data={stats.recentActivity} />
                    </div>
                </div>

                {/* Content Management */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Review Live Content</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Author</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allBlogs.slice(0, 5).map(blog => (
                                    <tr key={blog.id}>
                                        <td className="p-4">{blog.title}</td>
                                        <td className="p-4">{blog.author_name}</td>
                                        <td className="p-4 text-right text-red-600">
                                            <button className="hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">User Management</h2>
                    <form action={handleDeleteUser} className="flex gap-2 max-w-md">
                        <input name="email" required placeholder="user@example.com" className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:border-red-500" />
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">Delete User</button>
                    </form>
                </div>

            </div>
        </main>
    );
}

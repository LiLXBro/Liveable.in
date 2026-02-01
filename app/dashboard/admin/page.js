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
                    <h1 className="text-3xl font-bold text-slate-800">Chief Dashboard</h1>
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

                {/* Wide Blog Form */}
                <div className="mb-12">
                    <AdminBlogForm />
                </div>

                {/* Content Management */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                    <div className="p-6 border-b border-slate-100 mb-4">
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

                {/* Bottom Section: Team & User Management */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Team & User Management</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Editor Button (Bottom Left) */}
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-slate-500 mb-2">Add New Team Member</h3>
                            <AddEditorForm />
                        </div>

                        {/* Vertical Separator */}
                        <div className="hidden md:block w-px bg-slate-100 self-stretch"></div>

                        {/* Delete User (Bottom Right) */}
                        <div className="flex-1 w-full max-w-md">
                            <h3 className="text-sm font-semibold text-slate-500 mb-2">Remove User Access</h3>
                            <form action={handleDeleteUser} className="flex gap-2">
                                <input name="email" required placeholder="user@example.com" className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:border-red-500" />
                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium whitespace-nowrap">Delete User</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}

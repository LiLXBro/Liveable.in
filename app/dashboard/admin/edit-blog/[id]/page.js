import { getBlogById, getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import EditBlogForm from "@/components/EditBlogForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditBlogPage({ params }) {
    const session = await getSession();
    if (!session || session.userRole !== 'admin') {
        redirect('/login');
    }

    const blog = await getBlogById(params.id);
    if (!blog) {
        redirect('/dashboard/admin');
    }

    return (
        <main className="min-h-screen py-24 px-4 bg-slate-50">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Blog</h1>
                <p className="text-slate-500 text-sm mb-8">
                    Editing: <span className="font-medium text-slate-700">{blog.title}</span>
                </p>

                <EditBlogForm blog={blog} />
            </div>
        </main>
    );
}

import { getBlogs } from "@/app/actions";
import BlogCard from "@/components/BlogCard";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const blogs = await getBlogs('approved');

    return (
        <main className="min-h-screen py-24 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Community Stories</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        See how champions are transforming their cities, one block at a time.
                        Ranked by community impact.
                    </p>
                </div>

                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-2xl border border-slate-200">
                        <h3 className="text-xl font-medium text-slate-500">No stories yet. Be the first to share!</h3>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

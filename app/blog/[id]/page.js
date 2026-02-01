import { getBlogById, voteBlog, commentOnBlog } from "@/app/actions";
import { ThumbsUp, ThumbsDown, Calendar, MapPin, User } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }) {
    const blog = await getBlogById(params.id);

    if (!blog) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Blog not found</div>;
    }

    async function handleVote(formData) {
        'use server';
        const val = Number(formData.get('value'));
        await voteBlog(blog.id, val);
    }

    async function handleComment(formData) {
        'use server';
        const content = formData.get('content');
        await commentOnBlog(blog.id, content);
    }

    return (
        <main className="min-h-screen py-24 px-4">
            <article className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {blog.image_url && (
                    <div className="h-64 md:h-96 w-full bg-slate-100 relative">
                        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap gap-4 items-center text-sm text-slate-500 mb-6">
                        <span className="flex items-center gap-1 font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            <MapPin size={14} /> {blog.location_city}, {blog.location_state}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString('en-GB')}
                        </span>
                        <span className="flex items-center gap-1">
                            <User size={14} /> {blog.author_name || 'Unknown Champion'}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">{blog.title}</h1>

                    <div className="prose prose-slate lg:prose-lg max-w-none text-slate-600 mb-10">
                        {blog.content.split('\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
                    </div>

                    {/* Voting Section */}
                    <div className="flex items-center gap-6 py-6 border-y border-slate-100 mb-10">
                        <form action={handleVote} className="flex items-center gap-2">
                            <input type="hidden" name="value" value="1" />
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium">
                                <ThumbsUp size={18} />
                                <span>Upvote ({blog.upvotes})</span>
                            </button>
                        </form>
                        <form action={handleVote} className="flex items-center gap-2">
                            <input type="hidden" name="value" value="-1" />
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                                <ThumbsDown size={18} />
                                <span>Downvote ({blog.downvotes})</span>
                            </button>
                        </form>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-slate-800">Comments ({blog.comments?.length || 0})</h3>

                        <div className="space-y-6">
                            {blog.comments?.map(comment => (
                                <div key={comment.id} className="bg-slate-50 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-slate-700">{comment.author_name || 'Guest'}</span>
                                        <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">{comment.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment Form */}
                        <form action={handleComment} className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h4 className="font-semibold text-slate-700 mb-4">Leave a thought</h4>
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Comment</label>
                                <textarea name="content" required rows="3" className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500" placeholder="Share your thoughts..." />
                            </div>
                            <button className="bg-slate-800 text-white text-sm font-semibold py-2.5 px-6 rounded-lg hover:bg-black transition-colors">
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>
            </article>
        </main>
    );
}

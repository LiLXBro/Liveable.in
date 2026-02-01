'use client';

import Link from 'next/link';
import { ThumbsUp, ThumbsDown, MapPin, MessageCircle } from 'lucide-react';

export default function BlogCard({ blog }) {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {blog.image_url && (
                <div className="h-48 w-full bg-slate-200 relative">
                    {/* In real app, use Next.js Image */}
                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{blog.location_state}</span>
                    <span>•</span>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-GB')}</span>
                </div>

                <Link href={`/blog/${blog.id}`} className="block group">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                </Link>

                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {blog.content}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-green-600">
                            <ThumbsUp size={16} />
                            <span>{blog.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500">
                            <ThumbsDown size={16} />
                            <span>{blog.downvotes}</span>
                        </div>
                    </div>
                    <Link href={`/blog/${blog.id}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <MessageCircle size={16} />
                        <span>Read More</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

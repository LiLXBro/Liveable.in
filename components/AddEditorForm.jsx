'use client';

import { useState } from 'react';
import { createEditor } from '@/app/actions';
import { UserPlus, X } from 'lucide-react';

export default function AddEditorForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState(null);

    async function handleSubmit(formData) {
        const result = await createEditor(null, formData);
        setMessage(result.message);
        if (result.success) {
            setIsOpen(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
            >
                <UserPlus size={16} /> Add Editor
            </button>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-md relative">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
                <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Editor</h2>
            {message && <p className="mb-4 text-sm font-medium text-blue-600">{message}</p>}
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input name="name" required className="w-full p-2 border rounded" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Mobile)</label>
                    <input name="phone" required className="w-full p-2 border rounded" placeholder="9876543210" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email (Username)</label>
                    <input name="email" type="email" required className="w-full p-2 border rounded" placeholder="editor@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input name="password" type="password" required className="w-full p-2 border rounded" placeholder="********" />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
                    Create Editor
                </button>
            </form>
        </div>
    );
}

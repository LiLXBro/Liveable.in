'use client';

import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions';
import { useState } from 'react';
import Link from 'next/link';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50">
            {pending ? 'Logging in...' : 'Log In'}
        </button>
    );
}

export default function LoginPage() {
    const [message, setMessage] = useState(null);

    async function handleLogin(formData) {
        const result = await login(null, formData);
        if (result.success) {
            // Redirect based on role
            if (result.role === 'admin') window.location.href = '/dashboard/admin';
            else if (result.role === 'editor') window.location.href = '/dashboard/editor';
            else window.location.href = '/dashboard/champion';
        } else {
            setMessage(result.message);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Welcome Back</h1>

                {message && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
                        {message}
                    </div>
                )}

                <form action={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                        <input name="email" type="email" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
                        <input name="password" type="password" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:outline-none" />
                    </div>
                    <LoginButton />
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account? <Link href="/#join" className="text-blue-600 font-semibold hover:underline">Register as Champion</Link>
                </p>
            </div>
        </main>
    );
}

'use client';

import { useFormStatus } from 'react-dom';
import { submitChampion } from '@/app/actions';
import { useState } from 'react';
// import { useFormState } from 'react-dom'; // Next.js 14 canary, usually useActionState now or useFormState

// Workaround for useFormState in older Next 14 versions or standard React `useState` wrapper
// We will use a standard onSubmit for now to keep it simple with the server action, 
// or use the new hook if available. Let's stick to standard <form action> 

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
            {pending ? 'Joining...' : 'Join as Champion'}
        </button>
    );
}

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

export default function RegistrationForm() {
    const [message, setMessage] = useState(null);

    async function clientAction(formData) {
        const result = await submitChampion(null, formData);
        setMessage(result);
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-text-heading mb-6">Become a Champion</h3>

            {message && (
                <div className={`p-4 mb-6 rounded-lg text-sm ${message.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.message}
                </div>
            )}

            <form action={clientAction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">First Name</label>
                        <input name="first_name" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">Last Name</label>
                        <input name="last_name" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">Email</label>
                        <input name="email" type="email" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">Phone</label>
                        <input name="phone" type="tel" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-text-body mb-1">Address</label>
                    <input name="address" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>

                {/* City and Pin */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">City</label>
                        <input name="city" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">PIN Code</label>
                        <input name="pin_code" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1">Your State</label>
                        <select name="state" required className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="">Select State</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-body mb-1 text-primary">Target Champion State</label>
                        <select name="target_state" required className="w-full p-2 rounded border border-slate-300 bg-blue-50 focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="">Select Target State</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="pt-2">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}

'use client';

import { logout } from '@/app/actions';

export default function LogoutButton() {
    return (
        <form action={logout}>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                Log Out
            </button>
        </form>
    );
}

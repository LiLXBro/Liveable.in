'use client';

import Link from 'next/link';
import { LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { logout } from '@/app/actions';

export default function ProfileDropdown({ user }) {
    if (!user) return null;

    // Determine dashboard link based on role - keeping it simple based on earlier logic
    const dashboardLink = user.userRole === 'admin' ? '/dashboard/admin'
        : user.userRole === 'editor' ? '/dashboard/editor'
            : '/dashboard/champion';

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="outline-none rounded-full ring-2 ring-white/50 hover:ring-white transition-all">
                    {user.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[200px] bg-white rounded-xl shadow-xl border border-slate-100 p-2 mr-6 mt-2 animate-in fade-in zoom-in-95 duration-200 z-[100]"
                    sideOffset={5}
                >
                    <DropdownMenu.Item className="outline-none">
                        <Link href="/profile/edit" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                            <Settings size={16} />
                            <span>Edit Profile</span>
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="outline-none">
                        <Link href={dashboardLink} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />

                    <DropdownMenu.Item className="outline-none">
                        {/* We use a form for server action logout consistency */}
                        <form action={logout} className="w-full">
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </form>
                    </DropdownMenu.Item>

                    <DropdownMenu.Arrow className="fill-white" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";

export default function Header({ user }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/70 backdrop-blur-md shadow-sm py-2"
                : "bg-transparent py-4"
                }`}
        >
            <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
                {/* Brand & Tagline Group */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center group">
                        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
                            <span className="font-bold text-xl tracking-tight">Liveable.in</span>
                        </div>
                    </Link>

                    {/* Tagline */}
                    <div className="hidden md:block">
                        <span className={`text-lg font-medium tracking-wide transition-colors duration-300 ${isScrolled ? "text-slate-600" : "text-white/90 drop-shadow-sm"}`}>
                            vision of liveable indian cities
                        </span>
                    </div>
                </div>

                <nav className="flex items-center gap-6">
                    <Link href="/blog" className="text-sm font-semibold text-text-body hover:text-primary transition-colors">
                        Stories
                    </Link>

                    {user ? (
                        <ProfileDropdown user={user} />
                    ) : (
                        <Link
                            href="/login"
                            className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                        >
                            Join Now
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

import { Inter } from "next/font/google";
import Header from "@/components/Header";
import ThreeBackground from "@/components/ThreeBackground";
import "./globals.css";
import { getHeaderUser } from "@/app/actions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: "Liveable.in | Citizens for Liveable Indian Cities",
    description: "Join the movement for liveable cities in India.",
};

export default async function RootLayout({ children }) {
    const user = await getHeaderUser();

    // For better UX, let's make sure we have the email/profile info. 
    // I should create a getUserProfile helper or just update getSession to return more info if possible, 
    // or fetch it here.

    // User data is now fully handled by getHeaderUser
    let fullUser = null;
    // We already have 'user' which contains what we need for the header

    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans bg-background text-text-body antialiased`}>
                <ThreeBackground />
                <Header user={user} />
                {children}
            </body>
        </html>
    );
}

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: "CLIC.ORG | Citizens for Liveable Indian Cities",
    description: "Join the movement for liveable cities in India.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans bg-background text-text-body antialiased`}>
                {children}
            </body>
        </html>
    );
}

import './globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from './providers';
import Navbar from './components/Navbar';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata = {
    title: "Snake & Ladder",
    description: "Classic Snake & Ladder Game",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} bg-transparent text-slate-100 min-h-screen flex flex-col`}
            >
                <Providers>
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}

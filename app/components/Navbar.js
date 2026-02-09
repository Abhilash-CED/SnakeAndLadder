'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import authService from '../../src/services/authService';
import { LogOut, User, LucideShield } from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { t, i18n } = useTranslation();

    // Use state to force re-render on login/logout if needed using context, 
    // but sticking to original logic (user from authService)
    // In Next.js we might need a useEffect to check user on mount
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        setUser(authService.getCurrentUser());
    }, [pathname]); // Re-check on route change

    const handleLogout = () => {
        if (window.confirm(t('navbar_logout_confirm'))) {
            authService.logout();
            setUser(null);
            router.push('/');
        }
    };

    const handleChangeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const isTransparentPage = pathname === '/' || pathname === '/signup';

    return (
        <nav className={`${isTransparentPage
            ? 'fixed top-0 w-full bg-transparent z-50 border-none'
            : 'sticky top-0 z-50 bg-slate-900 border-white/10 shadow-lg backdrop-blur-md'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div
                        className="flex-shrink-0 cursor-pointer flex items-center gap-2 transition-transform hover:scale-105"
                        onClick={() => router.push('/game1')}
                    >
                        <span className="text-2xl animate-bounce">🎲</span>
                        <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {t('navbar_brand')}
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="relative">
                            <select
                                className="bg-slate-800 text-white font-medium border border-slate-600 rounded-md px-2 py-1 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none hover:bg-slate-700 transition"
                                onChange={handleChangeLanguage}
                                defaultValue="en"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="kn">Kannada</option>
                                <option value="ta">Tamil</option>
                                <option value="te">Telugu</option>
                                <option value="bn">Bengali</option>
                                <option value="ml">Malayalam</option>
                                <option value="gu">Gujarati</option>
                                <option value="pa">Punjabi</option>
                                <option value="or">Odia</option>
                                <option value="mr">Marathi</option>
                            </select>
                        </div>

                        {user && (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <button
                                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition border border-red-500/30 font-medium text-sm"
                                        onClick={() => router.push('/admin')}
                                    >
                                        <LucideShield />
                                        <span className="hidden sm:inline">{t('navbar_admin')}</span>
                                    </button>
                                )}

                                <div
                                    className="flex items-center gap-2 border border-slate-600 cursor-pointer px-3 py-1 rounded-md hover:bg-white/5 transition"
                                    onClick={() => router.push('/profile')}
                                >
                                    <User className='text-xs' />
                                    <span className="font-medium text-slate-200 hidden sm:inline">{user.username}</span>
                                </div>

                                <button
                                    className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition text-sm font-medium"
                                    onClick={handleLogout}
                                >
                                    <LogOut />
                                    <span className="hidden sm:inline">{t('navbar_logout')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import authService from '../src/services/authService';
import LoadingSpinner from './components/LoadingSpinner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const handleChangeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || email.trim() === '') {
            alert(t('login_email_empty'));
            return;
        }

        if (!password || password.trim() === '') {
            alert(t('login_password_empty'));
            return;
        }

        setLoading(true);

        try {
            await authService.login(email, password);
            router.push('/game1');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Background Image Placeholder or Gradient */}
            <div
                className="absolute inset-0 z-0 opacity-90"
                style={{
                    backgroundImage: 'url(/bg/loginBg1.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>

            {loading && <LoadingSpinner message={t('login_loading_message')} />}

            <div className="relative z-10 w-full max-w-md p-6 mt-10">
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
                    <h1 className="text-3xl font-bold text-center text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {t('login_title')}
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder={t('login_email_placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder={t('login_password_placeholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                                    onClick={() => alert(t('login_forgot_password_message'))}
                                >
                                    {t('login_forgot_password')}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? t('login_signing_in') : t('login_sign_in')}
                        </button>

                        <div className="text-center text-slate-400 text-sm mt-4">
                            {t('login_signup_prompt')}{' '}
                            <button
                                type="button"
                                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition"
                                onClick={() => router.push('/signup')}
                            >
                                {t('login_signup_button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

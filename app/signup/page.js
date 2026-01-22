'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import authService from '../../src/services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!username || username.trim() === '') {
            alert(t('signup_username_empty'));
            return;
        }

        if (!email || email.trim() === '') {
            alert(t('signup_email_empty'));
            return;
        }

        if (!password || password.trim() === '') {
            alert(t('signup_password_empty'));
            return;
        }

        setLoading(true);

        try {
            await authService.register(username, email, password);
            // alert(t('signup_success')); // Or just redirect
            router.push('/');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Reuse the background logic from Login */}
            <div
                className="absolute inset-0 z-0 opacity-90"
                style={{
                    backgroundImage: 'url(/bg/loginBg1.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>

            {loading && <LoadingSpinner message={t('signup_loading_message')} />}

            <div className="relative z-10 w-full max-w-md p-6 mt-20">
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
                    <h1 className="text-3xl font-bold text-center text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {t('signup_title')}
                    </h1>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Username</label>
                            <input
                                type="text"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder={t('signup_username_placeholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder={t('signup_email_placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder={t('signup_password_placeholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? t('signup_signing_up') : t('signup_sign_up')}
                        </button>

                        <div className="text-center text-slate-400 text-sm mt-4">
                            {t('signup_already_account')}{' '}
                            <button
                                type="button"
                                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition"
                                onClick={() => router.push('/')}
                            >
                                {t('signup_sign_in')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

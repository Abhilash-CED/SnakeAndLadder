'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
// ...

export default function GameLandingPage() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-900 bg-[url('/bg/gamebg.jpg')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-[url('/bg/gamebg.jpg')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900"></div>

            <div className="relative z-10 max-w-4xl w-full text-center space-y-12">

                {/* Hero Section */}
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-2xl mb-6">
                        {t('game_landing_title')}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {t('game_landing_desc')}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
                    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition group">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">🎯</div>
                        <h3 className="font-bold text-white mb-2">{t('game_feature_interactive')}</h3>
                        {/* <p className="text-sm text-slate-400">Engaging gameplay with animations and sounds.</p> */}
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700 hover:border-green-500 transition group">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">🐍</div>
                        <h3 className="font-bold text-white mb-2">{t('game_feature_snake_facts')}</h3>
                        {/* <p className="text-sm text-slate-400">Learn about real Indian snakes when you get bitten.</p> */}
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700 hover:border-yellow-500 transition group">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">❓</div>
                        <h3 className="font-bold text-white mb-2">{t('game_feature_quiz')}</h3>
                        {/* <p className="text-sm text-slate-400">Test your knowledge to save yourself from venom.</p> */}
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition group">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">🏆</div>
                        <h3 className="font-bold text-white mb-2">{t('game_feature_track_progress')}</h3>
                        {/* <p className="text-sm text-slate-400">Record your wins, losses, and moves over time.</p> */}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-8">
                    <button
                        onClick={() => router.push('/game')}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 ring-offset-2 focus:ring-2 ring-blue-400"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                        <span className="relative flex items-center gap-3 text-xl">
                            <span>▶</span>
                            Start Game
                        </span>
                    </button>
                    <p className="mt-4 text-slate-500 text-sm">Mode: Pass & Play (2 Players)</p>
                </div>
            </div>
        </div>
    );
}

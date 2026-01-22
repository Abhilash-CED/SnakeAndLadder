'use client';
import React, { useState, useEffect } from 'react';
import profileService from '../../src/services/profileService';
import LoadingSpinner from '../components/LoadingSpinner';

import { useTranslation } from 'react-i18next';
// ...
export default function ProfilePage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    // ...

    // In return JSX, replace hardcoded strings with t('key')
    // Example:
    // <label className="block text-sm text-slate-400 mb-1">{t('profile_region_label')}</label>
    // ...
    // <h2 className="text-xl font-bold text-white mb-6">{t('profile_recent_games_title')}</h2>
    // ...
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        region: '',
        language: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfileData(data);
            setFormData({
                region: data.user.region || 'International',
                language: data.user.language || 'English'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await profileService.updateProfile(formData);
            await fetchProfile();
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profileData) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );

    if (!profileData) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
            Failed to load profile. Please try again.
        </div>
    );

    const { user, stats, history } = profileData;

    // ...
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-900 bg-[url('/bg/gamebg.jpg')] bg-fixed bg-cover bg-center p-4">
            <div className="max-w-6xl mx-auto">

                {/* Helper: Overlay to darken BG */}
                <div className="fixed inset-0 bg-slate-900/90 -z-10"></div>

                {/* Header */}
                <div className="flex items-center justify-center gap-6 mb-12 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-2xl mb-4 p-[2px]">
                        <div className="bg-slate-900 w-full h-full rounded-full flex items-center justify-center">
                            👤
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
                        <p className="text-blue-300">{user.email}</p>
                        <p className="text-slate-500 text-sm mt-1">{t('profile_joined_prefix')} {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                    {/* Left Column: Settings */}
                    <div className='flex flex-col gap-8'>
                        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl h-fit">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">{t('profile_settings_title')}</h2>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                                        {t('profile_edit')}
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">{t('profile_region_label')}</label>
                                        <select
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="International">{t('profile_region_international')}</option>
                                            <option value="North America">{t('profile_region_na')}</option>
                                            <option value="Europe">{t('profile_region_europe')}</option>
                                            <option value="Asia">{t('profile_region_asia')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">{t('profile_language_label')}</label>
                                        <select
                                            value={formData.language}
                                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="English">{t('profile_language_en')}</option>
                                            <option value="Spanish">{t('profile_language_es')}</option>
                                            <option value="French">{t('profile_language_fr')}</option>
                                            <option value="Hindi">{t('profile_language_hi')}</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 text-white chat-sm font-bold py-2 rounded">{t('profile_save')}</button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold py-2 rounded">{t('profile_cancel')}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">{t('profile_region_label')}</span>
                                        <span className="text-white">{user.region || t('profile_region_international')}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">{t('profile_language_label')}</span>
                                        <span className="text-white">{user.language || 'English'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Middle Column: Stats */}
                        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl h-fit">
                            <h2 className="text-xl font-bold text-white mb-4">Analytics</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.total_games}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">{t('profile_stat_games_played')}</div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.avg_moves}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">{t('profile_stat_avg_moves')}</div>
                                </div>
                                <div className="bg-green-900/20 p-4 rounded-lg text-center border border-green-900/50">
                                    <div className="text-3xl font-bold text-green-400 mb-1">{stats.wins}</div>
                                    <div className="text-xs text-green-400/70 uppercase tracking-wider">{t('profile_stat_wins')}</div>
                                </div>
                                <div className="bg-red-900/20 p-4 rounded-lg text-center border border-red-900/50">
                                    <div className="text-3xl font-bold text-red-400 mb-1">{stats.losses}</div>
                                    <div className="text-xs text-red-400/70 uppercase tracking-wider">{t('profile_stat_losses')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: History */}
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl shadow-xl lg:col-span-1 h-fit max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                        <div className="bg-slate-900 sticky top-0 border-b border-slate-700 z-10 p-3 mb-4">
                            <h2 className="text-xl font-bold text-white">{t('profile_recent_games_title')}</h2>
                        </div>
                        <div className="space-y-3 p-3">
                            {history && history.length > 0 ? (
                                history.map((game, i) => (
                                    <div key={game.id || i} className={`p-3 rounded-lg border-l-4 ${game.result === 'WIN' ? 'bg-green-900/10 border-green-500' : 'bg-red-900/10 border-red-500'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-bold text-sm ${game.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                                                {game.result}
                                            </span>
                                            <span className="text-xs text-slate-500">{new Date(game.played_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm text-slate-300 flex justify-between">
                                            <span>{t('profile_vs_prefix')} {game.opponent_name || t('profile_vs_computer_label')}</span>
                                            <span className="text-slate-500">{game.moves} {t('profile_moves_suffix')}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-500 py-8 italic">
                                    {t('profile_no_history')}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

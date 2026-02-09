'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ResumeExitModal = ({ isOpen, onResume, onExit }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border-2 border-orange-500/50 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="text-center space-y-4">
                    <div className="text-4xl">⏸️</div>
                    <h3 className="text-2xl font-bold text-white">{t('resume_title')}</h3>

                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-slate-300 text-sm space-y-2">
                        <p>{t('resume_switched_tabs')}</p>
                        <p>{t('resume_question')}</p>
                        <div className="text-orange-400 font-bold mt-2 pt-2 border-t border-slate-700">
                            {t('resume_warning_loss')}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="btn bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow transition"
                        onClick={onResume}
                    >
                        {t('resume_resume_button')}
                    </button>
                    <button
                        type="button"
                        className="btn bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg shadow transition"
                        onClick={onExit}
                    >
                        {t('resume_exit_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeExitModal;

'use client';
import React from 'react';

const ResumeExitModal = ({ isOpen, onResume, onExit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border-2 border-orange-500/50 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="text-center space-y-4">
                    <div className="text-4xl">⏸️</div>
                    <h3 className="text-2xl font-bold text-white">Game Paused</h3>

                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-slate-300 text-sm space-y-2">
                        <p>You switched tabs or minimized the window.</p>
                        <p>Do you want to resume playing?</p>
                        <div className="text-orange-400 font-bold mt-2 pt-2 border-t border-slate-700">
                            ⚠️ Exiting counts as a LOSS!
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="btn bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow transition"
                        onClick={onResume}
                    >
                        ▶ Resume
                    </button>
                    <button
                        type="button"
                        className="btn bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg shadow transition"
                        onClick={onExit}
                    >
                        Quit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeExitModal;

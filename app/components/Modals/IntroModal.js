'use client';
import React, { useState, useEffect } from 'react';
import authService from '../../../src/services/authService';

const IntroModal = ({ isOpen, onSubmit }) => {
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');

    useEffect(() => {
        // We can use the authService or just get it from localStorage if we migrated logic
        // But since authService is still used, let's keep it.
        // Note: ensure authService is client-side compatible or mock it if needed
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setPlayer1Name(currentUser.username.toUpperCase());
        }
    }, []);

    const handleSubmit = () => {
        if (!player2Name.trim()) {
            alert('Opponent name is required!');
            return;
        }
        onSubmit(player1Name, player2Name.toUpperCase());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                    <h3 className="text-xl font-bold text-white text-center">Welcome to Snake & Ladder</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <div className="form-control w-full mb-4">
                            <label className="label">
                                <span className="label-text text-slate-300 font-semibold">You (Player 1)</span>
                            </label>
                            <input
                                type="text"
                                value={player1Name}
                                disabled
                                className="input input-bordered w-full bg-slate-600 text-slate-200 border-slate-500 cursor-not-allowed p-2 rounded"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-300 font-semibold">Opponent (Player 2)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Name..."
                                value={player2Name}
                                onChange={(e) => setPlayer2Name(e.target.value.toUpperCase())}
                                autoFocus
                                className="input input-bordered w-full bg-slate-900 border-blue-500 text-white focus:ring-2 focus:ring-blue-500 outline-none p-2 rounded"
                            />
                        </div>
                    </div>

                    <div className="text-slate-400 text-sm space-y-2 bg-slate-900/50 p-4 rounded border border-slate-700">
                        <p>1. Player 1 (You) starts the game.</p>
                        <p>2. Take turns rolling the dice.</p>
                        <p>3. First to reach 100 wins!</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-center">
                    <button
                        type="button"
                        className="btn bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        onClick={handleSubmit}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroModal;

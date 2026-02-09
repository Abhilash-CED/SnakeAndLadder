'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext';
import IntroModal from '../components/Modals/IntroModal';
import SnakeInfoModal from '../components/Modals/SnakeInfoModal';
import SnakeQuizModal from '../components/Modals/SnakeQuizModal';
import ResumeExitModal from '../components/Modals/ResumeExitModal';
import Board from '../components/Game/Board';
import Dice from '../components/Game/Dice';
import gameService from '../../src/services/gameService';
import authService from '../../src/services/authService';
import useAudio from '../hooks/useAudio';
import quizData from '../data/quizData.json';
import { useGameLogic } from '../hooks/useGameLogic';

export default function GamePage() {
    const router = useRouter();
    const { t } = useTranslation();

    const {
        player1,
        player2,
        p1sum,
        p2sum,
        currentTurn,
        gameStarted,
        winner,
        startGame,
        resetGame,
    } = useGame();

    const [showIntroModal, setShowIntroModal] = useState(true);
    const [showSnakeModal, setShowSnakeModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showResumeExitModal, setShowResumeExitModal] = useState(false);
    const [currentQuizQuestions, setCurrentQuizQuestions] = useState(null);
    const [currentSnakeName, setCurrentSnakeName] = useState('');
    const [diceRolling, setDiceRolling] = useState(false);
    const [p1DiceValue, setP1DiceValue] = useState(1);
    const [p2DiceValue, setP2DiceValue] = useState(1);
    const [gameExited, setGameExited] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);

    // Analytics State
    const [startTime, setStartTime] = useState(null);
    const [moveCount, setMoveCount] = useState(0);
    const [snakesHit, setSnakesHit] = useState(0);
    const [laddersClimbed, setLaddersClimbed] = useState(0);

    const gameCompletedRef = useRef(false);

    useEffect(() => {
        // If game is already started (e.g. from Context persistance), don't show intro
        if (gameStarted) {
            setShowIntroModal(false);
        }
    }, [gameStarted]);

    const handleLadderClimb = () => {
        if (currentTurn === 1) {
            setLaddersClimbed(prev => prev + 1);
        }
    };

    const { rollDice, makeMove, snakeInfo, setSnakeInfo, handleQuizResult } = useGameLogic(handleLadderClimb);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            alert(t('game_alert_login_first'));
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        if (snakeInfo) {
            setShowSnakeModal(true);
            setCurrentSnakeName(snakeInfo.name);
            if (currentTurn === 1) {
                setSnakesHit(prev => prev + 1);
            }
        }
    }, [snakeInfo, currentTurn]);

    useEffect(() => {
        if (winner) {
            gameCompletedRef.current = true;
            const endTime = Date.now();
            const durationSeconds = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
            const didWin = winner === player1;

            if (moveCount <= 0) {
                setTimeout(() => alert(t('game_alert_win_message', { winner })), 500);
                return;
            }

            const saveGame = async () => {
                try {
                    await gameService.recordGame({
                        opponent_name: player2,
                        result: didWin ? 'WIN' : 'LOSS',
                        moves: moveCount,
                        duration_seconds: durationSeconds,
                        snakes_hit: snakesHit,
                        ladders_climbed: laddersClimbed
                    });
                    console.log('Game stats saved successfully');
                } catch (error) {
                    console.error('Failed to save game stats:', error);
                }
            };

            saveGame();
            setTimeout(() => alert(t('game_alert_win_message', { winner })), 500);
        }
    }, [winner, startTime, player1, player2, moveCount, snakesHit, laddersClimbed]);

    // Page visibility & unload handling
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (gameStarted && !gameCompletedRef.current && !winner && !gameExited) {
                e.preventDefault();
                e.returnValue = t('game_beforeunload_text');
                return e.returnValue;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden && gameStarted && !winner && !gameExited && !gamePaused) {
                setGamePaused(true);
                setShowResumeExitModal(true);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [gameStarted, winner, gameExited, gamePaused]);

    const handleStartGame = (p1Name, p2Name) => {
        startGame(p1Name, p2Name);
        setShowIntroModal(false);
        setStartTime(Date.now());
        setMoveCount(0);
        setSnakesHit(0);
        setLaddersClimbed(0);
        gameCompletedRef.current = false;
    };

    const handleDiceRoll = () => {
        if (diceRolling || winner || gamePaused) return;

        setDiceRolling(true);
        const rolledValue = rollDice();

        if (currentTurn === 1) {
            setMoveCount(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentTurn === 1) setP1DiceValue(rolledValue);
            else setP2DiceValue(rolledValue);

            setDiceRolling(false);
            makeMove(rolledValue);
        }, 500);
    };

    const handleResetGame = async () => {
        if (window.confirm(t('game_exit_confirm'))) {
            if (gameStarted && !winner && !gameExited && moveCount > 0) {
                setGameExited(true);
                const endTime = Date.now();
                const durationSeconds = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

                try {
                    await gameService.recordGame({
                        opponent_name: player2,
                        result: 'LOSS',
                        moves: moveCount,
                        duration_seconds: durationSeconds,
                        snakes_hit: snakesHit,
                        ladders_climbed: laddersClimbed
                    });
                } catch (error) {
                    console.error('Failed to record game exit:', error);
                }
            }

            gameCompletedRef.current = false;
            resetGame();
            setShowIntroModal(true);
            setStartTime(null);
            setP1DiceValue(1);
            setP2DiceValue(1);
            setGameExited(false);
            setGamePaused(false);
            setMoveCount(0);
            setSnakesHit(0);
            setLaddersClimbed(0);
            router.push('/game1');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-900 bg-[url('/bg/gamebg.jpg')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative">
            {/* <div className="absolute inset-0 bg-black/40 pointer-events-none"></div> */}

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center">

                {/* Modals */}
                <IntroModal isOpen={showIntroModal} onSubmit={handleStartGame} />

                <SnakeInfoModal
                    isOpen={showSnakeModal}
                    snakeInfo={snakeInfo}
                    onClose={() => {
                        setShowSnakeModal(false);
                        if (snakeInfo && snakeInfo.quizIndex) {
                            const questions = quizData[snakeInfo.quizIndex];
                            if (questions && questions.length > 0) {
                                setCurrentQuizQuestions(questions);
                                setShowQuizModal(true);
                            } else {
                                // No quiz info found? Should not happen if data is consistent.
                                // Fallback: Just drop them via handleQuizResult but we didn't show quiz?
                                // If no questions, treat as 0/0 and 100% fall?
                                // Or maybe 100% correct? Let's say 0/0 -> treat as full fall or just fail safe.
                                // Let's call handleQuizResult(0,0) which defaults to 100% drop.
                                handleQuizResult(0, 0);
                            }
                        } else {
                            // No quiz index - maybe standard snake?
                            handleQuizResult(0, 0);
                        }
                        // Note: We do NOT clear snakeInfo here anymore in the quiz case, 
                        // because useGameLogic needs pending state. 
                        // Actually useGameLogic stores pending state separately.
                        // But if we clear snakeInfo here, does useGameLogic mind? No.
                        // However, if we clear it, SnakeInfoModal closes (good).
                    }}
                />

                <SnakeQuizModal
                    isOpen={showQuizModal}
                    snakeName={currentSnakeName}
                    questions={currentQuizQuestions}
                    onClose={() => {
                        setShowQuizModal(false);
                        setCurrentQuizQuestions(null);
                        setCurrentSnakeName('');
                    }}
                    onComplete={(score, total) => {
                        handleQuizResult(score, total);
                    }}
                />

                <ResumeExitModal
                    isOpen={showResumeExitModal}
                    onResume={() => {
                        setShowResumeExitModal(false);
                        setGamePaused(false);
                    }}
                    onExit={async () => {
                        // Duplicate exit logic here or allow context to handle it if refactored
                        // For now, implementing basic exit without recording to keep it simple or call handleResetGame logic
                        // Ideally this calls handleResetGame but without confirm
                        setGameExited(true);
                        gameCompletedRef.current = false;
                        resetGame();
                        setShowIntroModal(true);
                        setStartTime(null);
                        setGamePaused(false);
                        router.push('/game1');
                    }}
                />

                {winner && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-yellow-500/90 text-white text-3xl font-bold py-4 px-12 rounded-full shadow-2xl animate-bounce">
                        {t('game_winner_banner', { winner })}
                    </div>
                )}

                {/* Left Side: Board */}
                <div className="flex-grow w-full max-w-[85vh] flex-shrink-0">
                    <Board p1Position={p1sum} p2Position={p2sum} />
                </div>

                {/* Right Side: Controls & Players */}
                {gameStarted && (
                    <div className="w-full max-h-[75vh] lg:w-96 flex flex-col gap-6 bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-700 shadow-xl">
                        {/* Player 1 Card */}
                        <div className={`p-2 rounded-lg flex items-center justify-between transition-all ${currentTurn === 1 ? 'bg-blue-600 shadow-lg scale-105 ring-2 ring-blue-400' : 'bg-slate-700 opacity-80'}`}>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl bg-white/20 p-2 rounded-md">#1</div>
                                <div className="font-bold text-white">{player1}</div>
                            </div>
                            <div className="text-sm text-white/50 flex items-center gap-2">Position: <span className="text-2xl font-bold text-white">{p1sum}</span></div>
                        </div>

                        {/* Dice Area */}
                        <div className="flex justify-center items-center py-4 gap-8 bg-slate-900/50 rounded-lg">
                            <Dice
                                player={1}
                                value={p1DiceValue}
                                rolling={diceRolling && currentTurn === 1}
                                isActive={currentTurn === 1 && !winner && !gamePaused}
                                onRoll={handleDiceRoll}
                                disabled={currentTurn !== 1 || diceRolling || winner || gamePaused}
                                showArrow={currentTurn === 1 && !winner && !gamePaused}
                                color="blue"
                            />
                            <div className="h-16 w-[1px] bg-slate-600"></div>
                            <Dice
                                player={2}
                                value={p2DiceValue}
                                rolling={diceRolling && currentTurn === 2}
                                isActive={currentTurn === 2 && !winner && !gamePaused}
                                onRoll={handleDiceRoll}
                                disabled={currentTurn !== 2 || diceRolling || winner || gamePaused}
                                showArrow={currentTurn === 2 && !winner && !gamePaused}
                                color="red"
                            />
                        </div>

                        {/* Player 2 Card */}
                        <div className={`p-2 rounded-lg flex items-center justify-between transition-all ${currentTurn === 2 ? 'bg-red-600 shadow-lg scale-105 ring-2 ring-red-400' : 'bg-slate-700 opacity-80'}`}>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl bg-white/20 p-2 rounded-md">#2</div>
                                <div className="font-bold text-white">{player2}</div>
                            </div>
                            <div className="text-sm text-white/50 flex items-center gap-2">Position: <span className="text-2xl font-bold text-white">{p2sum}</span></div>
                        </div>

                        {/* Exit Button */}
                        <button
                            onClick={handleResetGame}
                            className="mt-auto w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg transition text-sm uppercase tracking-wide border border-slate-600"
                        >
                            {t('game_exit_button_label')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

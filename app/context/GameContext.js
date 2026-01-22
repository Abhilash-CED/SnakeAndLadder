'use client';
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [p1sum, setP1sum] = useState(0);
    const [p2sum, setP2sum] = useState(0);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [winner, setWinner] = useState(null);

    // Snake bite tracking
    const [bite1_98, setBite1_98] = useState(0);
    const [bite1_95, setBite1_95] = useState(0);
    const [bite2_98, setBite2_98] = useState(0);
    const [bite2_95, setBite2_95] = useState(0);

    const startGame = (p1Name, p2Name) => {
        setPlayer1(p1Name);
        setPlayer2(p2Name);
        setGameStarted(true);
        setP1sum(0);
        setP2sum(0);
        setCurrentTurn(1);
        setWinner(null);
    };

    const resetGame = () => {
        setP1sum(0);
        setP2sum(0);
        setCurrentTurn(1);
        setGameStarted(false);
        setWinner(null);
        setBite1_98(0);
        setBite1_95(0);
        setBite2_98(0);
        setBite2_95(0);
    };

    const switchTurn = () => {
        setCurrentTurn(currentTurn === 1 ? 2 : 1);
    };

    const updatePlayerPosition = (player, newPosition) => {
        if (player === 1) {
            setP1sum(newPosition);
            if (newPosition >= 100) {
                setWinner(player1);
            }
        } else {
            setP2sum(newPosition);
            if (newPosition >= 100) {
                setWinner(player2);
            }
        }
    };

    const value = {
        player1,
        player2,
        p1sum,
        p2sum,
        currentTurn,
        gameStarted,
        winner,
        bite1_98,
        bite1_95,
        bite2_98,
        bite2_95,
        setBite1_98,
        setBite1_95,
        setBite2_98,
        setBite2_95,
        startGame,
        resetGame,
        switchTurn,
        updatePlayerPosition,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

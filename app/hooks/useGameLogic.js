import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useAudio } from './useAudio';
import snakesData from '../data/snakesData.json';
import laddersData from '../data/laddersData.json';

export const useGameLogic = (onLadderClimb) => {
    const {
        p1sum,
        p2sum,
        currentTurn,
        player1,
        player2,
        bite1_98,
        bite1_95,
        bite2_98,
        bite2_95,
        setBite1_98,
        setBite1_95,
        setBite2_98,
        setBite2_95,
        updatePlayerPosition,
        switchTurn,
    } = useGame();

    const { playSound, playCustomSound } = useAudio();
    const [snakeInfo, setSnakeInfo] = useState(null);
    const [pendingSnakeMove, setPendingSnakeMove] = useState(null);

    const rollDice = useCallback(() => {
        playSound('dice');
        return Math.floor(Math.random() * 6) + 1;
    }, [playSound]);

    const checkSnake = useCallback((position, playerNum) => {
        const snakePos = snakesData[position];
        if (snakePos) {
            const playerName = playerNum === 1 ? player1 : player2;

            // Check bite tracking for positions 98 and 95
            if (position === 98) {
                if (playerNum === 1 && (bite1_98 === 0 || bite1_98 === 1)) {
                    setBite1_98(bite1_98 + 1);
                } else if (playerNum === 2 && (bite2_98 === 0 || bite2_98 === 1)) {
                    setBite2_98(bite2_98 + 1);
                } else {
                    return null; // Skip if already bitten twice
                }
            } else if (position === 95) {
                if (playerNum === 1 && (bite1_95 === 0 || bite1_95 === 1)) {
                    setBite1_95(bite1_95 + 1);
                } else if (playerNum === 2 && (bite2_95 === 0 || bite2_95 === 1)) {
                    setBite2_95(bite2_95 + 1);
                } else {
                    return null; // Skip if already bitten twice
                }
            }

            playCustomSound(snakePos.sound);

            return {
                newPosition: snakePos.newPosition,
                info: {
                    name: snakePos.name,
                    description: `${playerName} - ${snakePos.description}`,
                    images: snakePos.images,
                    thumbnails: snakePos.thumbnails,
                    quizIndex: snakePos.quizIndex,
                },
            };
        }
        return null;
    }, [player1, player2, bite1_98, bite1_95, bite2_98, bite2_95, setBite1_98, setBite1_95, setBite2_98, setBite2_95, playCustomSound]);

    const checkLadder = useCallback((position) => {
        const ladderEnd = laddersData[position];
        if (ladderEnd) {
            playSound('ladderUp');
            playSound('levelUp');
            // Notify parent about ladder climb
            if (onLadderClimb) {
                onLadderClimb();
            }
            return ladderEnd;
        }
        return null;
    }, [playSound, onLadderClimb]);

    const makeMove = useCallback((diceValue) => {
        const playerNum = currentTurn;
        const currentPosition = playerNum === 1 ? p1sum : p2sum;
        let newPosition = currentPosition + diceValue;

        // Don't move if it exceeds 100
        if (newPosition > 100) {
            switchTurn();
            return;
        }

        // Check for snake first
        const snakeResult = checkSnake(newPosition, playerNum);
        if (snakeResult) {
            // Found a snake - logic update:
            // 1. Show modal
            // 2. Move to Head (where they landed)
            // 3. Pause for quiz result
            setSnakeInfo(snakeResult.info);

            // Move player to Snake Head immediately so they see where they are
            updatePlayerPosition(playerNum, newPosition);

            setPendingSnakeMove({
                playerNum,
                head: newPosition,
                tail: snakeResult.newPosition
            });

            // Do NOT switch turn yet; waiting for quiz result
            return;
        }

        // Check for ladder only if no snake
        const ladderEnd = checkLadder(newPosition);
        if (ladderEnd) {
            newPosition = ladderEnd;
        }

        // Update position
        updatePlayerPosition(playerNum, newPosition);

        // Check for win
        if (newPosition === 100) {
            playSound('win');
        } else {
            switchTurn();
        }
    }, [currentTurn, p1sum, p2sum, checkSnake, checkLadder, updatePlayerPosition, switchTurn, playSound, setSnakeInfo]);

    const handleQuizResult = useCallback((score, totalQuestions) => {
        if (!pendingSnakeMove) return;

        const { playerNum, head, tail } = pendingSnakeMove;

        // Calculate distance to fall
        const totalDrop = head - tail; // e.g. 99 - 10 = 89 squares
        let penaltyFraction = 1; // Default fall 100%

        if (totalQuestions > 0) {
            const correctRatio = score / totalQuestions;
            if (correctRatio === 1) penaltyFraction = 0;      // 3/3 -> 0% drop
            else if (correctRatio >= 0.6) penaltyFraction = 0.33; // 2/3 -> 33% drop - 1/3rd of the snake length
            else if (correctRatio >= 0.3) penaltyFraction = 0.66; // 1/3 -> 66% drop - 2/3rd of the snake length
            else penaltyFraction = 1;                         // 0/3 -> 100% drop
        }

        const dropAmount = Math.floor(totalDrop * penaltyFraction);
        const finalPosition = head - dropAmount;

        if (dropAmount > 0) {
            playSound('levelDown');
        } else {
            // Maybe a small success sound if they saved themselves?
            playSound('levelUp');
        }

        updatePlayerPosition(playerNum, finalPosition);

        // Cleanup
        setPendingSnakeMove(null);
        setSnakeInfo(null);
        switchTurn();

    }, [pendingSnakeMove, updatePlayerPosition, switchTurn, playSound]);

    return {
        rollDice,
        makeMove,
        snakeInfo,
        setSnakeInfo,
        handleQuizResult,
    };
};

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

    /* ---------------------------------------------------
       Utility: Delay
    --------------------------------------------------- */
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    /* ---------------------------------------------------
       Dice
    --------------------------------------------------- */
    const rollDice = useCallback(() => {
        playSound('dice');
        return Math.floor(Math.random() * 6) + 1;
    }, [playSound]);

    /* ---------------------------------------------------
       Animate Dice Move (BOX BY BOX)
    --------------------------------------------------- */
    const animateDiceMove = async (playerNum, start, steps) => {
        let pos = start;

        for (let i = 0; i < steps; i++) {
            pos += 1;
            updatePlayerPosition(playerNum, pos);
            await delay(200); // 🎯 dice speed
        }

        return pos;
    };

    /* ---------------------------------------------------
       Snake Detection
    --------------------------------------------------- */
    const checkSnake = useCallback((position, playerNum) => {
        const snakePos = snakesData[position];
        if (!snakePos) return null;

        const playerName = playerNum === 1 ? player1 : player2;

        // Bite tracking (98, 95)
        if (position === 98) {
            if (playerNum === 1 && bite1_98 < 2) setBite1_98(bite1_98 + 1);
            else if (playerNum === 2 && bite2_98 < 2) setBite2_98(bite2_98 + 1);
            else return null;
        }

        if (position === 95) {
            if (playerNum === 1 && bite1_95 < 2) setBite1_95(bite1_95 + 1);
            else if (playerNum === 2 && bite2_95 < 2) setBite2_95(bite2_95 + 1);
            else return null;
        }

        playCustomSound(snakePos.sound);

        return {
            path: snakePos.path,
            info: {
                name: snakePos.name,
                description: `${playerName} - ${snakePos.description}`,
                images: snakePos.images,
                thumbnails: snakePos.thumbnails,
                quizIndex: snakePos.quizIndex,
            },
        };
    }, [
        player1, player2,
        bite1_98, bite1_95,
        bite2_98, bite2_95,
        setBite1_98, setBite1_95,
        setBite2_98, setBite2_95,
        playCustomSound
    ]);

    /* ---------------------------------------------------
       Ladder Detection (OLD LOGIC, JUST SLOW)
    --------------------------------------------------- */
    const checkLadder = useCallback((position) => {
        const ladderEnd = laddersData[position];
        if (!ladderEnd) return null;

        playSound('ladderUp');
        playSound('levelUp');

        if (onLadderClimb) onLadderClimb();
        return ladderEnd;
    }, [playSound, onLadderClimb]);

    /* ---------------------------------------------------
       MAIN MOVE LOGIC
    --------------------------------------------------- */
    const makeMove = useCallback(async (diceValue) => {
        const playerNum = currentTurn;
        const currentPosition = playerNum === 1 ? p1sum : p2sum;

        // Overshoot protection
        if (currentPosition + diceValue > 100) {
            switchTurn();
            return;
        }

        // 🎲 Dice movement (BOX BY BOX)
        const newPosition = await animateDiceMove(
            playerNum,
            currentPosition,
            diceValue
        );

        // 🐍 Snake
        const snakeResult = checkSnake(newPosition, playerNum);
        if (snakeResult) {
            setSnakeInfo(snakeResult.info);
            setPendingSnakeMove({
                playerNum,
                path: snakeResult.path
            });
            return;
        }

        // 🪜 Ladder (direct jump, slow)
        const ladderEnd = checkLadder(newPosition);
        if (ladderEnd) {
            await delay(400); // pause before jump
            updatePlayerPosition(playerNum, ladderEnd);
            switchTurn();
            return;
        }

        // 🏁 Win / Turn switch
        if (newPosition === 100) {
            playSound('win');
        } else {
            switchTurn();
        }
    }, [
        currentTurn,
        p1sum,
        p2sum,
        checkSnake,
        checkLadder,
        playSound,
        switchTurn
    ]);

    /* ---------------------------------------------------
       Quiz Result → Snake Fall
    --------------------------------------------------- */
    const handleQuizResult = useCallback((score, totalQuestions) => {
        if (!pendingSnakeMove) return;

        const { playerNum, path } = pendingSnakeMove;
        let targetIndex = 0;

        if (score === totalQuestions) targetIndex = 0;
        else if (score === totalQuestions - 1) targetIndex = 1;
        else if (score === 1) targetIndex = 2;
        else targetIndex = path.length - 1;

        playSound(targetIndex > 0 ? 'levelDown' : 'levelUp');

        updatePlayerPosition(playerNum, path[targetIndex]);

        setPendingSnakeMove(null);
        setSnakeInfo(null);
        switchTurn();
    }, [pendingSnakeMove, playSound, switchTurn, updatePlayerPosition]);

    /* ---------------------------------------------------
       Exposed API
    --------------------------------------------------- */
    return {
        rollDice,
        makeMove,
        snakeInfo,
        setSnakeInfo,
        handleQuizResult,
    };
};

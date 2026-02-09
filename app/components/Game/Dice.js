'use client';
import React from 'react';
// import './Dice.css'; // Removed as we use Tailwind and JSX styles

// Inline styles for dice dots positions
const dotStyles = {
    'top-left': { top: '20%', left: '20%' },
    'top-right': { top: '20%', right: '20%' },
    'bottom-left': { bottom: '20%', left: '20%' },
    'bottom-right': { bottom: '20%', right: '20%' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'middle-left': { top: '50%', left: '20%', transform: 'translateY(-50%)' },
    'middle-right': { top: '50%', right: '20%', transform: 'translateY(-50%)' }
};

const Dot = ({ position }) => (
    <span
        className="absolute w-3 h-3 bg-black rounded-full shadow-inner"
        style={dotStyles[position]}
    />
);

const Dice = ({ player, value = 1, rolling, isActive, onRoll, disabled, showArrow, color = 'white' }) => {
    const renderDots = () => {
        switch (value) {
            case 1: return [<Dot key="1" position="center" />];
            case 2: return [<Dot key="1" position="top-left" />, <Dot key="2" position="bottom-right" />];
            case 3: return [<Dot key="1" position="top-left" />, <Dot key="2" position="center" />, <Dot key="3" position="bottom-right" />];
            case 4: return [<Dot key="1" position="top-left" />, <Dot key="2" position="top-right" />, <Dot key="3" position="bottom-left" />, <Dot key="4" position="bottom-right" />];
            case 5: return [<Dot key="1" position="top-left" />, <Dot key="2" position="top-right" />, <Dot key="3" position="center" />, <Dot key="4" position="bottom-left" />, <Dot key="5" position="bottom-right" />];
            case 6: return [<Dot key="1" position="top-left" />, <Dot key="2" position="top-right" />, <Dot key="3" position="middle-left" />, <Dot key="4" position="middle-right" />, <Dot key="5" position="bottom-left" />, <Dot key="6" position="bottom-right" />];
            default: return [<Dot key="1" position="center" />];
        }
    };

    return (
        <div className={`relative flex flex-col items-center gap-4 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-90 opacity-70'}`}>
            {showArrow && (
                <div className="text-4xl text-yellow-400 animate-bounce font-bold drop-shadow-lg">
                    ⬇
                </div>
            )}
            <div
                onClick={!disabled ? onRoll : null}
                className={`
            w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_-5px_10px_rgba(0,0,0,0.2)] 
            relative cursor-pointer transition-transform duration-500 transform-style-3d animate-bounce 
            ${rolling ? 'animate-spin' : ''} 
            ${disabled ? 'cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}
            border-2 border-gray-400
        `}
                style={{
                    animation: rolling ? 'spin 0.5s linear infinite' : 'none'
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Container for dots needs to be relative to the face */}
                    <div className="w-full h-full relative">
                        {renderDots()}
                    </div>
                </div>
            </div>
            <div className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${player === 1 ? 'bg-blue-600 text-blue-100' : 'bg-red-600 text-red-100'}`}>
                Player {player}
            </div>
            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Dice;

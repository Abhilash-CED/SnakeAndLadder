'use client';
import React from 'react';
import Player from './Player';

const Board = ({ p1Position, p2Position }) => {
    // Generate board cells (100 to 1) for debugging/grid overlay if needed, 
    // but mostly we just need the image background and players.
    // The original loop (100 to 1) was for grid cells, likely for clicking or debugging.
    // We can keep it minimal.

    const cells = [];
    for (let i = 100; i >= 1; i--) {
        // Optional: Add IDs or debug overlay if needed
        // cells.push(<div key={i} className="absolute inset-0 border border-white/10 text-[10px] text-white/20 flex items-center justify-center">{i}</div>)
    }

    return (
        <div className="aspect-square w-full bg-slate-800 rounded-lg shadow-2xl relative overflow-hidden border-4 border-slate-700 mx-auto">
            {/* Container for maintaining aspect ratio and relative positioning */}
            <div className="relative w-full h-full">
                <img
                    src="/bg/board1.jpg"
                    alt="Game Board"
                    className="w-full h-full object-cover"
                />

                {/* Players Layer */}
                <div className="absolute inset-0">
                    <Player player={1} position={p1Position} />
                    <Player player={2} position={p2Position} />
                </div>
            </div>
        </div>
    );
};

export default Board;

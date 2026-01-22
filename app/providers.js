'use client';

import React from 'react';
import '../lib/i18n'; // Initialize i18n
import { GameProvider } from './context/GameContext';

export function Providers({ children }) {
    return (
        <GameProvider>
            {children}
        </GameProvider>
    );
}

import { query } from '../../../../lib/mysql';
import { verifyToken } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

async function authenticate(request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    return verifyToken(token);
}

export async function POST(request) {
    try {
        const user = await authenticate(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const {
            opponent_name,
            result,
            moves,
            duration_seconds,
            snakes_hit,
            ladders_climbed
        } = await request.json();

        await query(
            `INSERT INTO game_history 
             (player_id, opponent_name, result, moves, duration_seconds, snakes_hit, ladders_climbed) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.id, opponent_name, result, moves, duration_seconds, snakes_hit || 0, ladders_climbed || 0]
        );

        return NextResponse.json({ message: 'Game recorded successfully' }, { status: 201 });
    } catch (err) {
        console.error('Game Record Error:', err);
        return NextResponse.json({ error: 'Failed to record game' }, { status: 500 });
    }
}

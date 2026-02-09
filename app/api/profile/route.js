import { query, queryOne } from '../../../lib/mysql';
import { verifyToken } from '../../../lib/auth';
import { NextResponse } from 'next/server';

async function authenticate(request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    return verifyToken(token);
}

export async function GET(request) {
    try {
        const user = await authenticate(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 1. Get User Details
        const userDetails = await queryOne(
            'SELECT id, username, email, region, language, created_at FROM users WHERE id = ?',
            [user.id]
        );

        if (!userDetails) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Get Game History
        const history = await query(
            'SELECT * FROM game_history WHERE player_id = ? ORDER BY played_at DESC LIMIT 10',
            [user.id]
        );

        // 3. Get Stats
        const allGames = await query(
            'SELECT result, moves FROM game_history WHERE player_id = ?',
            [user.id]
        );

        const stats = {
            total_games: allGames?.length || 0,
            wins: allGames?.filter(g => g.result === 'WIN').length || 0,
            losses: allGames?.filter(g => g.result === 'LOSS').length || 0,
            avg_moves: allGames?.length ? Math.round(allGames.reduce((acc, curr) => acc + curr.moves, 0) / allGames.length) : 0
        };

        return NextResponse.json({ user: userDetails, history, stats });
    } catch (err) {
        console.error('Profile Error:', err);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await authenticate(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { region, language } = await request.json();

        await query(
            'UPDATE users SET region = ?, language = ? WHERE id = ?',
            [region, language, user.id]
        );

        const updatedUser = await queryOne('SELECT * FROM users WHERE id = ?', [user.id]);

        return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Update Error:', err);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

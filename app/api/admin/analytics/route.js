
import { query, queryOne } from '../../../../lib/mysql';
import { verifyToken } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

async function authenticateAdmin(request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    const user = verifyToken(token);
    if (!user || user.role !== 'admin') return null;
    return user;
}

export async function GET(request) {
    try {
        const admin = await authenticateAdmin(request);
        if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

        // 1. Overview Stats - Total Users
        const usersResult = await queryOne('SELECT COUNT(*) as count FROM users');
        const totalUsers = usersResult?.count || 0;

        // 2. Overview Stats - Total Games
        const gamesResult = await queryOne('SELECT COUNT(*) as count FROM game_history');
        const totalGames = gamesResult?.count || 0;

        // 3. Regional Stats
        const regionalStats = await query('SELECT region FROM users');

        const regions = regionalStats.reduce((acc, curr) => {
            const region = curr.region || 'Unknown';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});

        // 4. Movement Stats
        const movementData = await query(
            'SELECT snakes_hit, ladders_climbed, moves, result FROM game_history'
        );

        const movement = {
            total_snakes: 0,
            total_ladders: 0,
            avg_moves_win: 0
        };

        if (movementData && movementData.length > 0) {
            movement.total_snakes = movementData.reduce((sum, g) => sum + (g.snakes_hit || 0), 0);
            movement.total_ladders = movementData.reduce((sum, g) => sum + (g.ladders_climbed || 0), 0);

            const wins = movementData.filter(g => g.result === 'WIN');
            if (wins.length > 0) {
                const totalMoves = wins.reduce((sum, g) => sum + (g.moves || 0), 0);
                movement.avg_moves_win = Math.round(totalMoves / wins.length);
            }
        }

        // 5. Login Trends
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const loginHistory = await query(
            'SELECT login_time FROM login_history WHERE login_time >= ?',
            [sevenDaysAgo.toISOString().slice(0, 19).replace('T', ' ')]
        );

        let loginsByDay = {};
        if (loginHistory) {
            loginsByDay = loginHistory.reduce((acc, curr) => {
                const date = new Date(curr.login_time).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});
        }

        return NextResponse.json({
            overview: {
                totalUsers: totalUsers || 0,
                totalGames: totalGames || 0,
                activeRegions: Object.keys(regions).length
            },
            regions,
            movement,
            loginsByDay
        });

    } catch (err) {
        console.error('Analytics Error:', err);
        return NextResponse.json({ error: 'Failed to fetch analytics', details: err.message }, { status: 500 });
    }
}

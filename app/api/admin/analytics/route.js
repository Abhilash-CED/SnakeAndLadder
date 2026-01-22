
import { supabase } from '../../../../lib/supabase';
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
        const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // 2. Overview Stats - Total Games
        const { count: totalGames, error: gamesError } = await supabase
            .from('game_history')
            .select('*', { count: 'exact', head: true });

        if (gamesError) throw gamesError;

        // 3. Regional Stats
        const { data: regionalStats, error: regionError } = await supabase
            .from('users')
            .select('region');

        if (regionError) throw regionError;

        const regions = regionalStats.reduce((acc, curr) => {
            const region = curr.region || 'Unknown';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});

        // 4. Movement Stats
        const { data: movementData, error: movementError } = await supabase
            .from('game_history')
            .select('snakes_hit, ladders_climbed, moves, result');

        if (movementError) throw movementError;

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

        const { data: loginHistory, error: loginError } = await supabase
            .from('login_history')
            .select('login_time')
            .gte('login_time', sevenDaysAgo.toISOString());

        let loginsByDay = {};
        if (!loginError && loginHistory) {
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

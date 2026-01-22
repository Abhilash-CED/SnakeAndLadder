
import { supabase } from '../../../../lib/supabase';
import { signToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Find user by email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Record Login History
        // Note: In Next.js App Router, finding genuine IP might require headers inspection (x-forwarded-for)
        // For now we'll skip IP or try to get it from headers if critical
        // const ip = request.headers.get('x-forwarded-for') || 'unknown'; 
        // await supabase.from('login_history').insert([{ user_id: user.id, ip_address: ip }]);

        // Generate JWT token
        const token = signToken({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role || 'user'
        });

        return NextResponse.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            },
        }, { status: 200 });

    } catch (err) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

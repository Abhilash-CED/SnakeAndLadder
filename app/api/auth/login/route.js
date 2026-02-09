import { query, queryOne } from '../../../../lib/mysql';
import { signToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Find user by email
        const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

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

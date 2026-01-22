
import { supabase } from '../../../../lib/supabase';
import { signToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password, username } = await request.json();

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${email},username.eq.${username}`)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: existingUser.email === email ? 'Email already registered' : 'Username already taken' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                {
                    username,
                    email,
                    password_hash: passwordHash,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        // Generate JWT token
        const token = signToken({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role || 'user'
        });

        return NextResponse.json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role || 'user'
            },
        }, { status: 201 });

    } catch (err) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

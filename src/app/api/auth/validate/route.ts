import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        const response = await fetch(`${backendUrl}/auth/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ success: true, user: data.user });
        } else {
            return NextResponse.json(
                { success: false, message: data.message || 'Token validation failed' },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 
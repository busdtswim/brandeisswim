// src/app/api/auth/lessons/payment/route.js

import { NextResponse } from 'next/server';
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function PUT(request) {
    try {
        const { lessonId, swimmerId, status } = await request.json();

        if (!lessonId || !swimmerId || status === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        if (isNaN(parseInt(lessonId)) || isNaN(parseInt(swimmerId))) {
            return NextResponse.json(
                { error: 'Invalid lesson ID or swimmer ID' }, 
                { status: 400 }
            );
        }

        const updated = await SwimmerLessonStore.update(parseInt(swimmerId), parseInt(lessonId), {
            payment_status: status,
        });

        if (!updated) {
            return NextResponse.json(
                { error: 'Registration not found' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json(
            { error: 'Failed to update payment status' }, 
            { status: 500 }
        );
    }
}
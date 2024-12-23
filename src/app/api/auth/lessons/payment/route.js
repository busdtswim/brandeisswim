// src/app/api/auth/lessons/payment/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request) {
    try {
        const { lessonId, swimmerId, status } = await request.json();

        if (!lessonId || !swimmerId || status === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        const updated = await prisma.swimmer_lessons.update({
            where: {
                swimmer_id_lesson_id: {
                    swimmer_id: parseInt(swimmerId),
                    lesson_id: parseInt(lessonId),
                },
            },
            data: {
                payment_status: status,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json(
            { error: 'Failed to update payment status' }, 
            { status: 500 }
        );
    }
}
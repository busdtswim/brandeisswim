// src/app/api/auth/logout/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  return response;
}
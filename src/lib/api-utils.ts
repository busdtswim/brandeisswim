// src/lib/api-utils.ts
import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export interface ApiError {
  success: false;
  error: string;
  status?: number;
}

export interface ApiSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
}

export type TypedApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Helper function to create success responses
export function createSuccessResponse<T>(
  data?: T, 
  message?: string, 
  status: number = 200
): NextResponse<TypedApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, message },
    { status }
  );
}

// Helper function to create error responses
export function createErrorResponse(
  error: string, 
  status: number = 500
): NextResponse<TypedApiResponse> {
  return NextResponse.json(
    { success: false, error },
    { status }
  );
}

// Helper function to validate required fields
export function validateRequiredFields(
  data: Record<string, any>, 
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Helper function to handle async API operations
export async function handleApiOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<NextResponse<TypedApiResponse<T>>> {
  try {
    const result = await operation();
    return createSuccessResponse(result);
  } catch (error) {
    console.error('API Error:', error);
    return createErrorResponse(errorMessage);
  }
}

// Helper function to parse and validate request body
export async function parseRequestBody<T>(
  req: NextRequest,
  requiredFields?: string[]
): Promise<{ data: T; error: string | null }> {
  try {
    const data = await req.json() as T;
    
    if (requiredFields) {
      const validationError = validateRequiredFields(data as Record<string, any>, requiredFields);
      if (validationError) {
        return { data, error: validationError };
      }
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: {} as T, error: 'Invalid request body' };
  }
}

// Helper function to check authentication
export function requireAuth(session: any): string | null {
  if (!session || !session.user) {
    return 'Authentication required';
  }
  return null;
}

// Helper function to check admin role
export function requireAdmin(session: any): string | null {
  const authError = requireAuth(session);
  if (authError) return authError;
  
  if (session.user.role !== 'admin') {
    return 'Admin access required';
  }
  return null;
}

// Helper function to check customer role
export function requireCustomer(session: any): string | null {
  const authError = requireAuth(session);
  if (authError) return authError;
  
  if (session.user.role !== 'customer') {
    return 'Customer access required';
  }
  return null;
} 
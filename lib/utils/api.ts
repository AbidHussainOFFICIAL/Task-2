import type { ApiError, ApiResponse } from '@/types'

/**
 * Build a structured success response.
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return { data, error: null }
}

/**
 * Build a structured error response.
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, string[]> | string
): ApiResponse<null> {
  return { data: null, error: { code, message, details } }
}

/**
 * Parse Supabase error into a standardized API error.
 */
export function parseSupabaseError(error: { code?: string; message: string; details?: string }): ApiError {
  // Handle unique constraint violations
  if (error.code === '23505') {
    const field = error.details?.includes('email') ? 'email_address' : 'vendor_reference'
    return {
      code: 'DUPLICATE_ENTRY',
      message: `A record with this ${field === 'email_address' ? 'email address' : 'reference code'} already exists.`,
      details: field,
    }
  }

  // Handle foreign key violations
  if (error.code === '23503') {
    return {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'The referenced vendor does not exist.',
    }
  }

  // Handle check constraint violations
  if (error.code === '23514') {
    return {
      code: 'CONSTRAINT_VIOLATION',
      message: 'The data provided violates a database constraint.',
    }
  }

  return {
    code: 'DATABASE_ERROR',
    message: error.message ?? 'An unexpected database error occurred.',
  }
}

// =====================================================
// AUTHENTICATION MIDDLEWARE FOR NEXT.JS API ROUTES
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { AuthSession, UserRole, ApiResponse, ErrorCode } from '../types';
import { verifyToken, refreshToken, updateLastActivity, hasRole } from '../lib/auth';

// Extended NextRequest with session
export interface AuthenticatedRequest extends NextRequest {
  session?: AuthSession;
}

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

export async function authenticate(
  req: AuthenticatedRequest
): Promise<{ session: AuthSession; refreshedToken?: string } | NextResponse> {
  // Extract token from Authorization header or cookie
  const authHeader = req.headers.get('authorization');
  const cookieToken = req.cookies.get('session_token')?.value;

  const token = authHeader?.replace('Bearer ', '') || cookieToken;

  if (!token) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: 'No authentication token provided',
        },
      },
      { status: 401 }
    );
  }

  // Verify token
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: ErrorCode.SESSION_EXPIRED,
          message: 'Session expired or invalid. Please login again.',
        },
      },
      { status: 401 }
    );
  }

  // Update last activity
  const updatedSession = updateLastActivity(session);

  // Check if token needs refresh
  const refreshResult = await refreshToken(updatedSession);

  if (refreshResult) {
    // Token was refreshed
    return {
      session: refreshResult.session,
      refreshedToken: refreshResult.token,
    };
  }

  // Token is still valid
  return { session: updatedSession };
}

// =====================================================
// ROLE-BASED ACCESS CONTROL
// =====================================================

export function requireRoles(allowedRoles: UserRole[]) {
  return async (req: AuthenticatedRequest): Promise<AuthSession | NextResponse> => {
    const authResult = await authenticate(req);

    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { session } = authResult;

    if (!hasRole(session, allowedRoles)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: ErrorCode.FORBIDDEN,
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          },
        },
        { status: 403 }
      );
    }

    return session;
  };
}

// =====================================================
// SPECIFIC ROLE GUARDS
// =====================================================

export const requirePlatformAdmin = requireRoles(['platform_admin']);
export const requireSocietyAdmin = requireRoles(['society_admin', 'platform_admin']);
export const requireResident = requireRoles(['resident', 'society_admin', 'platform_admin']);
export const requireVendor = requireRoles(['vendor', 'platform_admin']);

// Combined guards
export const requireSocietyOrResident = requireRoles(['society_admin', 'resident', 'platform_admin']);
export const requireSocietyOrVendor = requireRoles(['society_admin', 'vendor', 'platform_admin']);

// =====================================================
// SOCIETY ACCESS GUARD
// =====================================================

export async function requireSocietyAccess(
  req: AuthenticatedRequest,
  societyId: string
): Promise<AuthSession | NextResponse> {
  const authResult = await authenticate(req);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { session } = authResult;

  // Platform admin can access all societies
  if (session.role === 'platform_admin') {
    return session;
  }

  // Check if user has access to this society
  if (session.role === 'society_admin' || session.role === 'resident') {
    if (session.societyId !== societyId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: ErrorCode.FORBIDDEN,
            message: 'You do not have access to this society',
          },
        },
        { status: 403 }
      );
    }
    return session;
  }

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code: ErrorCode.FORBIDDEN,
        message: 'Insufficient permissions to access this resource',
      },
    },
    { status: 403 }
  );
}

// =====================================================
// VENDOR ACCESS GUARD
// =====================================================

export async function requireVendorAccess(
  req: AuthenticatedRequest,
  vendorId: string
): Promise<AuthSession | NextResponse> {
  const authResult = await authenticate(req);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { session } = authResult;

  // Platform admin can access all vendors
  if (session.role === 'platform_admin') {
    return session;
  }

  // Vendor can only access their own data
  if (session.role === 'vendor') {
    if (session.vendorId !== vendorId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: ErrorCode.FORBIDDEN,
            message: 'You do not have access to this vendor',
          },
        },
        { status: 403 }
      );
    }
    return session;
  }

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code: ErrorCode.FORBIDDEN,
        message: 'Insufficient permissions to access this resource',
      },
    },
    { status: 403 }
  );
}

// =====================================================
// HELPER: ADD REFRESHED TOKEN TO RESPONSE
// =====================================================

export function addRefreshedTokenToResponse(
  response: NextResponse,
  token: string
): NextResponse {
  // Add token to response header
  response.headers.set('X-Refreshed-Token', token);

  // Also set as cookie
  response.cookies.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });

  return response;
}

// =====================================================
// ERROR HANDLER WRAPPER
// =====================================================

export function withErrorHandler<T>(
  handler: (req: AuthenticatedRequest, context?: any) => Promise<T>
) {
  return async (req: AuthenticatedRequest, context?: any): Promise<T | NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error('API Error:', error);

      // Handle known errors
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              code: ErrorCode.DUPLICATE_ENTRY,
              message: 'This entry already exists',
              details: error.meta,
            },
          },
          { status: 409 }
        ) as T;
      }

      if (error.code === 'P2025') {
        // Prisma record not found
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: 'Resource not found',
            },
          },
          { status: 404 }
        ) as T;
      }

      // Generic error
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: ErrorCode.INTERNAL_ERROR,
            message: 'An unexpected error occurred',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          },
        },
        { status: 500 }
      ) as T;
    }
  };
}

// =====================================================
// VALIDATION ERROR HELPER
// =====================================================

export function validationError(message: string, details?: any): NextResponse {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message,
        details,
      },
    },
    { status: 400 }
  );
}

// =====================================================
// SUCCESS RESPONSE HELPER
// =====================================================

export function successResponse<T>(data: T, meta?: any): NextResponse {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      meta,
    },
    { status: 200 }
  );
}

// =====================================================
// CREATED RESPONSE HELPER
// =====================================================

export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status: 201 }
  );
}

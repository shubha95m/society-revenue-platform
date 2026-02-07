// =====================================================
// AUTH CONTROLLER - Request Handling
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types';
import { authenticate } from '../middleware/auth';

export class AuthController {

  // =====================================================
  // REGISTER
  // =====================================================

  async register(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json() as RegisterRequest;

      // Validate required fields
      if (!body.email || !body.password || !body.firstName || !body.lastName || !body.role) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Missing required fields',
            },
          },
          { status: 400 }
        );
      }

      // Validate role-specific fields
      if ((body.role === 'resident' || body.role === 'society_admin') && (!body.societyId || !body.flatNumber)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Society ID and flat number required for residents',
            },
          },
          { status: 400 }
        );
      }

      if (body.role === 'vendor' && !body.businessName) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Business name required for vendors',
            },
          },
          { status: 400 }
        );
      }

      // Call service
      const result = await authService.register(body);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'REGISTRATION_FAILED',
              message: result.error,
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: result,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Register controller error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Registration failed',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // LOGIN
  // =====================================================

  async login(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json() as LoginRequest;

      // Validate required fields
      if (!body.email || !body.password) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Email and password are required',
            },
          },
          { status: 400 }
        );
      }

      // Call service
      const result = await authService.login(body);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'LOGIN_FAILED',
              message: result.error,
            },
          },
          { status: 401 }
        );
      }

      // Set cookie for browser clients
      const response = NextResponse.json(
        {
          success: true,
          data: result,
        },
        { status: 200 }
      );

      if (result.session) {
        response.cookies.set('auth_token', result.session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/',
        });
      }

      return response;
    } catch (error: any) {
      console.error('Login controller error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Login failed',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  async logout(req: NextRequest): Promise<NextResponse> {
    try {
      const response = NextResponse.json(
        {
          success: true,
          data: {
            message: 'Logged out successfully',
          },
        },
        { status: 200 }
      );

      // Clear auth cookie
      response.cookies.delete('auth_token');

      return response;
    } catch (error: any) {
      console.error('Logout controller error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Logout failed',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // GET SESSION
  // =====================================================

  async getSession(req: NextRequest): Promise<NextResponse> {
    try {
      // Authenticate and get session
      const authResult = await authenticate(req as any);

      if (authResult instanceof NextResponse) {
        return authResult;
      }

      const { session, refreshedToken } = authResult;

      // Get full user data
      const user = await authService.getUserById(session.userId);

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          },
          { status: 404 }
        );
      }

      const response = NextResponse.json(
        {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              status: user.status,
              resident: user.resident ? {
                id: user.resident.id,
                societyId: user.resident.societyId,
                flatNumber: user.resident.flatNumber,
                tower: user.resident.tower,
                society: user.resident.society,
              } : undefined,
              vendor: user.vendor ? {
                id: user.vendor.id,
                businessName: user.vendor.businessName,
                status: user.vendor.status,
              } : undefined,
            },
            session: {
              expiresAt: session.expiresAt.toISOString(),
            },
          },
        },
        { status: 200 }
      );

      // If token was refreshed, update cookie
      if (refreshedToken) {
        response.cookies.set('auth_token', refreshedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60,
          path: '/',
        });
      }

      return response;
    } catch (error: any) {
      console.error('Get session controller error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get session',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // REFRESH TOKEN
  // =====================================================

  async refreshToken(req: NextRequest): Promise<NextResponse> {
    try {
      // Authenticate and check for refresh
      const authResult = await authenticate(req as any);

      if (authResult instanceof NextResponse) {
        return authResult;
      }

      const { session, refreshedToken } = authResult;

      if (!refreshedToken) {
        return NextResponse.json(
          {
            success: true,
            data: {
              message: 'Token is still valid, no refresh needed',
              session: {
                expiresAt: session.expiresAt.toISOString(),
              },
            },
          },
          { status: 200 }
        );
      }

      const response = NextResponse.json(
        {
          success: true,
          data: {
            message: 'Token refreshed successfully',
            session: {
              token: refreshedToken,
              expiresAt: session.expiresAt.toISOString(),
            },
          },
        },
        { status: 200 }
      );

      // Update cookie
      response.cookies.set('auth_token', refreshedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      return response;
    } catch (error: any) {
      console.error('Refresh token controller error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to refresh token',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  async updatePassword(req: NextRequest): Promise<NextResponse> {
    try {
      // Authenticate
      const authResult = await authenticate(req as any);

      if (authResult instanceof NextResponse) {
        return authResult;
      }

      const { session } = authResult;
      const body = await req.json();

      // Validate required fields
      if (!body.oldPassword || !body.newPassword) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Old password and new password are required',
            },
          },
          { status: 400 }
        );
      }

      // Call service
      const success = await authService.updatePassword(
        session.userId,
        body.oldPassword,
        body.newPassword
      );

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UPDATE_FAILED',
              message: 'Failed to update password. Please check your old password.',
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            message: 'Password updated successfully',
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Update password controller error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update password',
          },
        },
        { status: 500 }
      );
    }
  }
}

// Export singleton instance
export const authController = new AuthController();

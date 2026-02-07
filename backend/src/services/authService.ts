// =====================================================
// AUTH SERVICE - Business Logic
// =====================================================

import { prisma } from '../lib/prisma';
import {
  hashPassword,
  verifyPassword,
  createSession,
  createToken,
  validateEmail,
  validatePassword,
} from '../lib/auth';
import { RegisterRequest, LoginRequest, AuthResponse, UserRole } from '../types';

export class AuthService {

  // =====================================================
  // REGISTER
  // =====================================================

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Validate email
      if (!validateEmail(data.email)) {
        return {
          success: false,
          error: 'Invalid email format',
        };
      }

      // Validate password
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.message,
        };
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
            status: 'pending_verification',
          },
        });

        // Create role-specific record
        let societyId: string | undefined;
        let vendorId: string | undefined;
        let residentId: string | undefined;

        if (data.role === 'resident' || data.role === 'society_admin') {
          if (!data.societyId || !data.flatNumber) {
            throw new Error('Society ID and flat number required for residents');
          }

          const resident = await tx.resident.create({
            data: {
              userId: user.id,
              societyId: data.societyId,
              flatNumber: data.flatNumber,
              tower: data.tower,
              isPrimaryResident: data.role === 'society_admin',
              isVerified: data.role === 'society_admin',
            },
          });

          societyId = data.societyId;
          residentId = resident.id;
        } else if (data.role === 'vendor') {
          if (!data.businessName) {
            throw new Error('Business name required for vendors');
          }

          const vendor = await tx.vendor.create({
            data: {
              userId: user.id,
              businessName: data.businessName,
              status: 'pending_verification',
            },
          });

          vendorId = vendor.id;
        }

        return { user, societyId, vendorId, residentId };
      });

      // Create session
      const session = createSession({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role as UserRole,
        societyId: result.societyId,
        vendorId: result.vendorId,
        residentId: result.residentId,
      });

      // Create token
      const token = await createToken(session);

      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role as UserRole,
          status: result.user.status as any,
        },
        session: {
          token,
          expiresAt: session.expiresAt.toISOString(),
        },
      };
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  // =====================================================
  // LOGIN
  // =====================================================

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user with role-specific data
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: {
          resident: true,
          vendor: true,
        },
      });

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      const validPassword = await verifyPassword(data.password, user.passwordHash);
      if (!validPassword) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Check if user is active
      if (user.status === 'suspended') {
        return {
          success: false,
          error: 'Your account has been suspended. Please contact support.',
        };
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Create session
      const session = createSession({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        societyId: user.resident?.societyId,
        vendorId: user.vendor?.id,
        residentId: user.resident?.id,
      });

      // Create token
      const token = await createToken(session);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as UserRole,
          status: user.status as any,
        },
        session: {
          token,
          expiresAt: session.expiresAt.toISOString(),
        },
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed',
      };
    }
  }

  // =====================================================
  // GET USER BY ID
  // =====================================================

  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          resident: {
            include: {
              society: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
              status: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // =====================================================
  // VERIFY EMAIL
  // =====================================================

  async verifyEmail(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
      return true;
    } catch (error) {
      console.error('Verify email error:', error);
      return false;
    }
  }

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return false;
      }

      // Verify old password
      const validPassword = await verifyPassword(oldPassword, user.passwordHash);
      if (!validPassword) {
        return false;
      }

      // Validate new password
      const validation = validatePassword(newPassword);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      return true;
    } catch (error) {
      console.error('Update password error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

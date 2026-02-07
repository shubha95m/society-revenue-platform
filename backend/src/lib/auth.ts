// =====================================================
// AUTHENTICATION UTILITIES
// =====================================================

import { SignJWT, jwtVerify } from 'jose';
import { AuthSession, UserRole } from '../types';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

// Session configuration
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const REFRESH_THRESHOLD = 15 * 60 * 1000; // Refresh if < 15 min remaining

// =====================================================
// JWT TOKEN MANAGEMENT
// =====================================================

export async function createToken(session: AuthSession): Promise<string> {
  const token = await new SignJWT({ session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(session.expiresAt)
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const session = (verified.payload as any).session as AuthSession;

    // Convert dates from strings to Date objects
    session.expiresAt = new Date(session.expiresAt);
    session.lastActivityAt = new Date(session.lastActivityAt);

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      return null;
    }

    // Check for inactivity timeout
    const inactivityDuration = Date.now() - session.lastActivityAt.getTime();
    if (inactivityDuration > ACTIVITY_TIMEOUT) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

export async function refreshToken(session: AuthSession): Promise<{ token: string; session: AuthSession } | null> {
  const now = new Date();
  const timeUntilExpiry = session.expiresAt.getTime() - now.getTime();

  // Only refresh if token is expiring soon
  if (timeUntilExpiry > REFRESH_THRESHOLD) {
    return null;
  }

  // Create new session with extended expiry
  const newSession: AuthSession = {
    ...session,
    expiresAt: new Date(Date.now() + SESSION_DURATION),
    lastActivityAt: now,
  };

  const token = await createToken(newSession);

  return { token, session: newSession };
}

export function updateLastActivity(session: AuthSession): AuthSession {
  return {
    ...session,
    lastActivityAt: new Date(),
  };
}

// =====================================================
// PASSWORD MANAGEMENT
// =====================================================

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =====================================================
// SESSION CREATION
// =====================================================

export function createSession(user: {
  id: string;
  email: string;
  role: UserRole;
  societyId?: string;
  vendorId?: string;
  residentId?: string;
}): AuthSession {
  const now = new Date();

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    societyId: user.societyId,
    vendorId: user.vendorId,
    residentId: user.residentId,
    expiresAt: new Date(now.getTime() + SESSION_DURATION),
    lastActivityAt: now,
  };
}

// =====================================================
// ROLE CHECKS
// =====================================================

export function hasRole(session: AuthSession, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(session.role);
}

export function isSocietyAdmin(session: AuthSession): boolean {
  return session.role === 'society_admin';
}

export function isResident(session: AuthSession): boolean {
  return session.role === 'resident';
}

export function isVendor(session: AuthSession): boolean {
  return session.role === 'vendor';
}

export function isPlatformAdmin(session: AuthSession): boolean {
  return session.role === 'platform_admin';
}

export function canAccessSociety(session: AuthSession, societyId: string): boolean {
  // Platform admin can access all societies
  if (session.role === 'platform_admin') {
    return true;
  }

  // Society admin and residents can only access their society
  if (session.role === 'society_admin' || session.role === 'resident') {
    return session.societyId === societyId;
  }

  return false;
}

export function canAccessVendor(session: AuthSession, vendorId: string): boolean {
  // Platform admin can access all vendors
  if (session.role === 'platform_admin') {
    return true;
  }

  // Vendor can only access their own data
  if (session.role === 'vendor') {
    return session.vendorId === vendorId;
  }

  return false;
}

// =====================================================
// VALIDATION
// =====================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation (can be customized)
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

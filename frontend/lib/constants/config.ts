/**
 * App Configuration
 * Shared between web and mobile
 */

export const config = {
  app: {
    name: 'Society Revenue Platform',
    shortName: 'SRP',
    description: 'Reduce society maintenance by 30-70% through ethical revenue streams',
  },

  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    timeout: 30000, // 30 seconds
  },

  auth: {
    tokenKey: 'srp_auth_token',
    refreshTokenKey: 'srp_refresh_token',
    tokenExpiry: 15 * 60 * 1000, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },

  validation: {
    minPasswordLength: 8,
    maxPasswordLength: 128,
    otpLength: 6,
    otpExpiry: 5 * 60 * 1000, // 5 minutes
  },

  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },

  features: {
    enableBiometricAuth: false, // Will be true for mobile
    enablePushNotifications: false, // Will be true for mobile
    enableOfflineMode: false, // Will be true for mobile
  },
};

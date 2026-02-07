// PUT /api/auth/password
import { NextRequest } from 'next/server';
import { authController } from '../../../controllers/authController';

export async function PUT(req: NextRequest) {
  return authController.updatePassword(req);
}

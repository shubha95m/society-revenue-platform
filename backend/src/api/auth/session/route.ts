// GET /api/auth/session
import { NextRequest } from 'next/server';
import { authController } from '../../../controllers/authController';

export async function GET(req: NextRequest) {
  return authController.getSession(req);
}

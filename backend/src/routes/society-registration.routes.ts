import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, createSession, createToken } from '../lib/auth';

const router = Router();

// POST /api/society-registration/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      // Society details
      societyName,
      address,
      city,
      state,
      pincode,
      totalFlats,
      totalBuildings,
      amenities,
      currentMaintenance,
      // Admin details
      adminName,
      adminEmail,
      adminPhone,
      password,
    } = req.body;

    // Validate required fields
    if (!societyName || !address || !city || !state || !pincode || !totalFlats) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'All society fields are required' },
      });
    }

    if (!adminName || !adminEmail || !adminPhone || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'All admin fields are required' },
      });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email already exists' },
      });
    }

    // Generate slug from society name
    const slug = societyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if society slug exists
    const existingSociety = await prisma.societies.findUnique({ where: { slug } });
    if (existingSociety) {
      return res.status(400).json({
        success: false,
        error: { code: 'SOCIETY_EXISTS', message: 'A society with this name already exists' },
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Split name into first and last name
    const nameParts = adminName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create user and society in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.users.create({
        data: {
          id: crypto.randomUUID(),
          email: adminEmail,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: 'society_admin',
          status: 'pending_verification',
        },
      });

      // Create society
      const society = await tx.societies.create({
        data: {
          id: crypto.randomUUID(),
          name: societyName,
          slug,
          address_line1: address,
          city,
          state,
          country: 'India',
          pincode,
          total_flats: parseInt(totalFlats),
          total_towers: totalBuildings ? parseInt(totalBuildings) : 1,
          admin_name: adminName,
          admin_email: adminEmail,
          admin_phone: adminPhone,
          monthly_maintenance_charge: currentMaintenance ? parseFloat(currentMaintenance) : null,
          amenities_info: amenities ? JSON.parse(JSON.stringify(amenities.split(',').map((a: string) => a.trim()))) : [],
          status: 'onboarding',
          subscription_tier: 'basic',
        },
      });

      return { user, society };
    });

    // Create session and token
    const session = createSession({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role as any,
    });
    const token = await createToken(session);

    res.status(201).json({
      success: true,
      message: 'Society registration submitted successfully. You will receive an email once verified.',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: `${result.user.first_name} ${result.user.last_name}`.trim(),
          role: result.user.role,
        },
        society: {
          id: result.society.id,
          name: result.society.name,
          slug: result.society.slug,
          status: result.society.status,
        },
        session: {
          token,
          expiresAt: session.expiresAt,
          lastActivityAt: session.lastActivityAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Society registration error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
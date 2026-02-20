/**
 * Seed Platform Admin User
 * Run: npx tsx scripts/seed-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding platform admin user...\n');

  // Platform Admin credentials
  const adminEmail = 'admin@societyrevenue.com';
  const adminPassword = 'Admin@123456';
  const adminName = 'Platform Admin';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.users.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('✅ Platform admin already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   ID: ${existingAdmin.id}\n`);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create platform admin
    const admin = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email: adminEmail,
        password_hash: passwordHash,
        name: adminName,
        role: 'platform_admin',
        status: 'active',
      },
    });

    console.log('✅ Platform admin created successfully!\n');
    console.log('📧 Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}\n`);
    console.log('🔗 Login URL: http://localhost:3000/login\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
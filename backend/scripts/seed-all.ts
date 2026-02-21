/**
 * Seed All Test Users
 * Run: npx tsx scripts/seed-all.ts
 *
 * Creates:
 * - Platform Admin
 * - Society Admin + Society
 * - Resident
 * - Vendor
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding all test users...\\n');

  try {
    // 1. PLATFORM ADMIN
    console.log('1️⃣  Creating Platform Admin...');
    const adminEmail = 'admin@societyrevenue.com';
    const adminPassword = 'Admin@123456';

    let admin = await prisma.users.findUnique({ where: { email: adminEmail } });

    if (!admin) {
      const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
      admin = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: adminEmail,
          password_hash: adminPasswordHash,
          first_name: 'Platform',
          last_name: 'Admin',
          role: 'platform_admin',
          status: 'active',
        },
      });
      console.log('   ✅ Platform Admin created');
    } else {
      console.log('   ℹ️  Platform Admin already exists');
    }
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Password: ${adminPassword}\\n`);

    // 2. SOCIETY ADMIN + SOCIETY
    console.log('2️⃣  Creating Society Admin + Society...');
    const societyAdminEmail = 'rajesh@greenvalley.com';
    const societyAdminPassword = 'Test@123456';
    const societyName = 'Green Valley Apartments';
    const societySlug = 'green-valley-apartments';

    let societyAdmin = await prisma.users.findUnique({ where: { email: societyAdminEmail } });
    let society = await prisma.societies.findUnique({ where: { slug: societySlug } });

    if (!societyAdmin || !society) {
      const societyAdminPasswordHash = await bcrypt.hash(societyAdminPassword, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            id: crypto.randomUUID(),
            email: societyAdminEmail,
            password_hash: societyAdminPasswordHash,
            first_name: 'Rajesh',
            last_name: 'Kumar',
            role: 'society_admin',
            status: 'active', // Active for testing
          },
        });

        const soc = await tx.societies.create({
          data: {
            id: crypto.randomUUID(),
            name: societyName,
            slug: societySlug,
            address_line1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            pincode: '400001',
            total_flats: 100,
            total_towers: 4,
            admin_name: 'Rajesh Kumar',
            admin_email: societyAdminEmail,
            admin_phone: '9876543210',
            monthly_maintenance_charge: 5000,
            amenities_info: JSON.parse(JSON.stringify(['Gym', 'Pool', 'Garden'])),
            status: 'approved', // Approved for testing
            subscription_tier: 'premium',
          },
        });

        return { user, society: soc };
      });

      societyAdmin = result.user;
      society = result.society;
      console.log('   ✅ Society Admin and Society created');
    } else {
      console.log('   ℹ️  Society Admin and Society already exist');
    }
    console.log(`   📧 Email: ${societyAdminEmail}`);
    console.log(`   🔑 Password: ${societyAdminPassword}`);
    console.log(`   🏢 Society: ${societyName}\\n`);

    // 3. RESIDENT
    console.log('3️⃣  Creating Resident...');
    const residentEmail = 'john.doe@example.com';
    const residentPassword = 'Test@123456';

    let resident = await prisma.users.findUnique({ where: { email: residentEmail } });
    let residentProfile = null;

    if (!resident) {
      const residentPasswordHash = await bcrypt.hash(residentPassword, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            id: crypto.randomUUID(),
            email: residentEmail,
            password_hash: residentPasswordHash,
            first_name: 'John',
            last_name: 'Doe',
            role: 'resident',
            status: 'active',
          },
        });

        const profile = await tx.residents.create({
          data: {
            id: crypto.randomUUID(),
            user_id: user.id,
            society_id: society!.id,
            flat_number: 'A-101',
            name: 'John Doe',
            phone: '9876543211',
            status: 'active',
          },
        });

        return { user, profile };
      });

      resident = result.user;
      residentProfile = result.profile;
      console.log('   ✅ Resident created');
    } else {
      residentProfile = await prisma.residents.findFirst({ where: { user_id: resident.id } });
      console.log('   ℹ️  Resident already exists');
    }
    console.log(`   📧 Email: ${residentEmail}`);
    console.log(`   🔑 Password: ${residentPassword}`);
    console.log(`   🏠 Flat: A-101 at ${societyName}\\n`);

    // 4. VENDOR
    console.log('4️⃣  Creating Vendor...');
    const vendorEmail = 'vendor@freshgroceries.com';
    const vendorPassword = 'Test@123456';
    const businessName = 'Fresh Groceries Pvt Ltd';

    let vendor = await prisma.users.findUnique({ where: { email: vendorEmail } });
    let vendorProfile = null;

    if (!vendor) {
      const vendorPasswordHash = await bcrypt.hash(vendorPassword, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            id: crypto.randomUUID(),
            email: vendorEmail,
            password_hash: vendorPasswordHash,
            first_name: 'Amit',
            last_name: 'Shah',
            role: 'vendor',
            status: 'active', // Active for testing
          },
        });

        const profile = await tx.vendors.create({
          data: {
            id: crypto.randomUUID(),
            user_id: user.id,
            business_name: businessName,
            business_type: 'Grocery Store',
            phone: '9123456789',
            gst_number: '27AABCU9603R1ZV',
            city: 'Mumbai',
            state: 'Maharashtra',
            status: 'approved', // Approved for testing
          },
        });

        return { user, profile };
      });

      vendor = result.user;
      vendorProfile = result.profile;
      console.log('   ✅ Vendor created');
    } else {
      vendorProfile = await prisma.vendors.findFirst({ where: { user_id: vendor.id } });
      console.log('   ℹ️  Vendor already exists');
    }
    console.log(`   📧 Email: ${vendorEmail}`);
    console.log(`   🔑 Password: ${vendorPassword}`);
    console.log(`   🏪 Business: ${businessName}\\n`);

    // 5. CREATE A SAMPLE SERVICE FOR THE VENDOR
    console.log('5️⃣  Creating Sample Services...');
    if (vendorProfile) {
      const existingService = await prisma.services.findFirst({
        where: { vendor_id: vendorProfile.id },
      });

      if (!existingService) {
        await prisma.services.create({
          data: {
            id: crypto.randomUUID(),
            vendor_id: vendorProfile.id,
            name: 'Fresh Vegetables Delivery',
            description: 'Daily fresh vegetables delivered to your doorstep',
            category: 'Groceries',
            pricing_type: 'per_order',
            base_price: 500,
            status: 'active',
          },
        });
        console.log('   ✅ Sample service created\\n');
      } else {
        console.log('   ℹ️  Service already exists\\n');
      }
    }

    console.log('\\n✅ All test users seeded successfully!\\n');
    console.log('📋 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Role             | Email                         ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Platform Admin   | admin@societyrevenue.com      ');
    console.log('Society Admin    | rajesh@greenvalley.com        ');
    console.log('Resident         | john.doe@example.com          ');
    console.log('Vendor           | vendor@freshgroceries.com     ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\\n🔑 All passwords: Test@123456 (except admin: Admin@123456)\\n');
    console.log('📖 See Users.md for complete details\\n');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
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

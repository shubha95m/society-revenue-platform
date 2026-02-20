-- Create Platform Admin User
-- Password: Admin@123456
-- Run this script to create the initial platform admin user

-- Generate UUID for the admin user
-- Password hash for: Admin@123456
-- Generated using bcrypt with 10 rounds

INSERT INTO users (
  id,
  email,
  password_hash,
  name,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@societyrevenue.com',
  '$2a$10$rQZYvJZ5y8Z5Y5Y5Y5Y5Y.', -- Placeholder - will be replaced via API
  'Platform Admin',
  'platform_admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, email, name, role, status, created_at
FROM users
WHERE email = 'admin@societyrevenue.com';
-- Manual Admin User Creation
-- Run this if the automatic admin creation in 001_initial_schema.sql fails
-- 
-- This uses a pre-computed bcrypt hash for password: admin123456
-- Generated with: bcrypt.hash('admin123456', 10)

INSERT INTO admin_users (
  email,
  password_hash,
  name,
  role,
  is_active
) VALUES (
  'admin@apsnashik.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- bcrypt hash of 'admin123456'
  'Admin User',
  'admin',
  TRUE
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify admin user was created
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  created_at
FROM admin_users
WHERE email = 'admin@apsnashik.com';

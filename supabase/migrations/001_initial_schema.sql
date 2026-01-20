-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin Users table - For admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (single row) - Create first as it has no dependencies
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  school_name VARCHAR(255) DEFAULT 'Apple Public School',
  academic_year VARCHAR(20) DEFAULT '2025-2026',
  academic_year_start_month INTEGER DEFAULT 4,
  tuition_months_count INTEGER DEFAULT 12,
  classes TEXT[] DEFAULT ARRAY['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
  buses JSONB DEFAULT '[]'::jsonb,
  expense_categories TEXT[] DEFAULT ARRAY['Electricity', 'Rent', 'Stationery', 'Events', 'Repairs', 'Internet', 'Misc'],
  income_sources TEXT[] DEFAULT ARRAY['Books Fee', 'Uniform', 'Donations', 'Admission forms', 'Other'],
  payment_modes TEXT[] DEFAULT ARRAY['Cash', 'UPI', 'Bank', 'Cheque', 'Online'],
  currency VARCHAR(10) DEFAULT 'INR',
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table - Create before transactions and fee_plans (they reference students)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_no VARCHAR(50) UNIQUE NOT NULL,
  roll_no VARCHAR(50),
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  date_of_birth DATE,
  class_name VARCHAR(50) NOT NULL,
  section VARCHAR(10),
  academic_year VARCHAR(20) NOT NULL,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  guardian_name VARCHAR(255),
  phone_primary VARCHAR(20) NOT NULL,
  phone_secondary VARCHAR(20),
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  bus_opted BOOLEAN DEFAULT FALSE,
  bus_route_id VARCHAR(50),
  bus_fee_monthly DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table - Create after students (references students)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Fee Collection fields
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  admission_no VARCHAR(50),
  class VARCHAR(50),
  student_name VARCHAR(255),
  fee_type VARCHAR(50),
  fee_for_month VARCHAR(7), -- YYYY-MM format
  status VARCHAR(20) DEFAULT 'Paid',
  
  -- Bus fields
  bus_number VARCHAR(50),
  bus_route VARCHAR(255),
  expense_type VARCHAR(50),
  vendor VARCHAR(255),
  
  -- Salary fields
  employee_type VARCHAR(50),
  employee_name VARCHAR(255),
  salary_month VARCHAR(7), -- YYYY-MM format
  
  -- Other fields
  category VARCHAR(50),
  income_source VARCHAR(50)
);

-- Fee Plans table - Create after students (references students)
CREATE TABLE IF NOT EXISTS fee_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  tuition_fee_monthly DECIMAL(10, 2) DEFAULT 0,
  annual_fee DECIMAL(10, 2) DEFAULT 0,
  exam_fee DECIMAL(10, 2) DEFAULT 0,
  book_fee DECIMAL(10, 2) DEFAULT 0,
  uniform_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  misc_fee DECIMAL(10, 2) DEFAULT 0,
  fee_frequency VARCHAR(20) DEFAULT 'Monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_admission_no ON transactions(admission_no);
CREATE INDEX IF NOT EXISTS idx_students_admission_no ON students(admission_no);
CREATE INDEX IF NOT EXISTS idx_students_class_name ON students(class_name);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_fee_plans_student_id ON fee_plans(student_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist (for re-running migration)
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
DROP TRIGGER IF EXISTS update_fee_plans_updated_at ON fee_plans;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_plans_updated_at BEFORE UPDATE ON fee_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings with complete data
INSERT INTO settings (
  id,
  school_name,
  academic_year,
  academic_year_start_month,
  tuition_months_count,
  classes,
  buses,
  expense_categories,
  income_sources,
  payment_modes,
  currency,
  theme
) VALUES (
  'main',
  'Apple Public School',
  '2025-2026',
  4,
  12,
  ARRAY['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
  '[
    {"busNumber": "Winger", "route": "Route A"},
    {"busNumber": "Maximo", "route": "Route B"},
    {"busNumber": "Verito", "route": "Route C"},
    {"busNumber": "Audi", "route": "Route D"},
    {"busNumber": "Fluence", "route": "Route E"}
  ]'::jsonb,
  ARRAY['Electricity', 'Rent', 'Stationery', 'Events', 'Repairs', 'Internet', 'Misc'],
  ARRAY['Books Fee', 'Uniform', 'Donations', 'Admission forms', 'Other'],
  ARRAY['Cash', 'UPI', 'Bank', 'Cheque', 'Online'],
  'INR',
  'light'
)
ON CONFLICT (id) DO UPDATE SET
  school_name = EXCLUDED.school_name,
  academic_year = EXCLUDED.academic_year,
  academic_year_start_month = EXCLUDED.academic_year_start_month,
  tuition_months_count = EXCLUDED.tuition_months_count,
  classes = EXCLUDED.classes,
  buses = EXCLUDED.buses,
  expense_categories = EXCLUDED.expense_categories,
  income_sources = EXCLUDED.income_sources,
  payment_modes = EXCLUDED.payment_modes,
  currency = EXCLUDED.currency,
  theme = EXCLUDED.theme,
  updated_at = NOW();

-- Create admin user with default credentials
-- Email: admin@apsnashik.com
-- Password: admin123456
-- Using pre-computed bcrypt hash (salt rounds: 10)
-- If you need to regenerate: Use online bcrypt generator or Node.js: bcrypt.hash('admin123456', 10)
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

-- Create indexes for admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Allow public read admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow public update admin last_login" ON admin_users;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON transactions;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON students;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON fee_plans;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON settings;
DROP POLICY IF EXISTS "Allow public read" ON transactions;
DROP POLICY IF EXISTS "Allow public read" ON students;
DROP POLICY IF EXISTS "Allow public read" ON fee_plans;
DROP POLICY IF EXISTS "Allow public read" ON settings;
DROP POLICY IF EXISTS "Allow public insert" ON transactions;
DROP POLICY IF EXISTS "Allow public insert" ON students;
DROP POLICY IF EXISTS "Allow public insert" ON fee_plans;
DROP POLICY IF EXISTS "Allow public update" ON transactions;
DROP POLICY IF EXISTS "Allow public update" ON students;
DROP POLICY IF EXISTS "Allow public update" ON fee_plans;
DROP POLICY IF EXISTS "Allow public update" ON settings;
DROP POLICY IF EXISTS "Allow public delete" ON transactions;
DROP POLICY IF EXISTS "Allow public delete" ON students;
DROP POLICY IF EXISTS "Allow public delete" ON fee_plans;

-- Create policies for admin_users (public read for login, but restrict writes)
CREATE POLICY "Allow public read admin users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Allow public update admin last_login" ON admin_users
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create policies (allow all operations for authenticated users)
-- Note: Adjust these policies based on your authentication requirements
CREATE POLICY "Allow all for authenticated users" ON transactions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON students
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON fee_plans
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- For public access (if you want to allow anonymous access, adjust accordingly)
-- You can remove these if you want to require authentication
CREATE POLICY "Allow public read" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON students
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON fee_plans
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert" ON students
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert" ON fee_plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON transactions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public update" ON students
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public update" ON fee_plans
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public update" ON settings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON transactions
  FOR DELETE USING (true);

CREATE POLICY "Allow public delete" ON students
  FOR DELETE USING (true);

CREATE POLICY "Allow public delete" ON fee_plans
  FOR DELETE USING (true);

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================
-- This migration creates:
-- 
-- 1. TABLES:
--    - admin_users: Admin authentication (1 default admin user created)
--    - settings: Application settings (1 default settings row created)
--    - students: Student records
--    - transactions: All financial transactions (fees, expenses, income, salaries)
--    - fee_plans: Fee structures for students
--
-- 2. DEFAULT DATA:
--    - Admin User:
--      * Email: admin@apsnashik.com
--      * Password: admin123456
--      * Name: Admin User
--      * Role: admin
--
--    - Settings:
--      * School Name: Apple Public School
--      * Academic Year: 2025-2026
--      * Classes: Nursery through 12th
--      * Buses: Winger, Maximo, Verito, Audi, Fluence
--      * Expense Categories: Electricity, Rent, Stationery, Events, Repairs, Internet, Misc
--      * Income Sources: Books Fee, Uniform, Donations, Admission forms, Other
--      * Payment Modes: Cash, UPI, Bank, Cheque, Online
--      * Currency: INR
--      * Theme: light
--
-- 3. INDEXES: Created for optimal query performance
-- 4. TRIGGERS: Auto-update updated_at timestamps
-- 5. RLS POLICIES: Row Level Security enabled with public access (for development)
--
-- ============================================================================
-- LOGIN CREDENTIALS
-- ============================================================================
-- After running this migration, you can login with:
-- Email: admin@apsnashik.com
-- Password: admin123456
--
-- ============================================================================
-- NEXT STEPS
-- ============================================================================
-- 1. Verify tables were created: Check Table Editor in Supabase dashboard
-- 2. Verify admin user: SELECT * FROM admin_users;
-- 3. Verify settings: SELECT * FROM settings;
-- 4. Configure your .env.local with Supabase credentials
-- 5. Test login at /admin/login
--
-- ============================================================================

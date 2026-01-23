-- Add additional identity and transport fields to students table

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(12),
  ADD COLUMN IF NOT EXISTS previous_school_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
  ADD COLUMN IF NOT EXISTS caste_category VARCHAR(50),
  ADD COLUMN IF NOT EXISTS caste_other VARCHAR(255),
  ADD COLUMN IF NOT EXISTS birth_place VARCHAR(255),
  ADD COLUMN IF NOT EXISTS bus_route_address TEXT;


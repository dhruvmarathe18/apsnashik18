-- Migration: Remove tuition_fee_monthly and fee_frequency from fee_plans table
-- These fields are no longer needed as fees will be calculated differently

-- Drop columns from fee_plans table
ALTER TABLE fee_plans 
  DROP COLUMN IF EXISTS tuition_fee_monthly,
  DROP COLUMN IF EXISTS fee_frequency;

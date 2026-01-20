-- Migration to remove fee_for_month column from transactions table
-- This field is no longer needed as we removed monthly tuition fees

ALTER TABLE transactions
DROP COLUMN IF EXISTS fee_for_month;

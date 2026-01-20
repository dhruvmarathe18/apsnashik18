-- Bus Management Migration
-- This migration adds tables for bus daily entries and integrates with transactions

-- Bus Daily Entries table
CREATE TABLE IF NOT EXISTS bus_daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_name VARCHAR(50) NOT NULL,
  entry_date DATE NOT NULL,
  driver_name VARCHAR(255),
  start_km DECIMAL(10, 2),
  end_km DECIMAL(10, 2),
  daily_km DECIMAL(10, 2) DEFAULT 0,
  diesel_filled DECIMAL(10, 2) DEFAULT 0,
  diesel_rate DECIMAL(10, 2) DEFAULT 0,
  diesel_amount DECIMAL(10, 2) DEFAULT 0,
  expense_description TEXT,
  other_expense DECIMAL(10, 2) DEFAULT 0,
  running_km DECIMAL(10, 2) DEFAULT 0,
  actual_average DECIMAL(10, 2) DEFAULT 0,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bus_name, entry_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bus_daily_entries_bus_name ON bus_daily_entries(bus_name);
CREATE INDEX IF NOT EXISTS idx_bus_daily_entries_entry_date ON bus_daily_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_bus_daily_entries_driver_name ON bus_daily_entries(driver_name);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_bus_daily_entries_updated_at ON bus_daily_entries;
CREATE TRIGGER update_bus_daily_entries_updated_at
  BEFORE UPDATE ON bus_daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE bus_daily_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bus_daily_entries
DROP POLICY IF EXISTS "Allow public read bus daily entries" ON bus_daily_entries;
CREATE POLICY "Allow public read bus daily entries"
  ON bus_daily_entries FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert bus daily entries" ON bus_daily_entries;
CREATE POLICY "Allow public insert bus daily entries"
  ON bus_daily_entries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update bus daily entries" ON bus_daily_entries;
CREATE POLICY "Allow public update bus daily entries"
  ON bus_daily_entries FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete bus daily entries" ON bus_daily_entries;
CREATE POLICY "Allow public delete bus daily entries"
  ON bus_daily_entries FOR DELETE
  USING (true);

-- Function to automatically create bus expense transactions when daily entry is created/updated
CREATE OR REPLACE FUNCTION create_bus_expense_transaction()
RETURNS TRIGGER AS $$
DECLARE
  total_expense DECIMAL(10, 2);
  existing_transaction_id UUID;
BEGIN
  -- Calculate total expense (diesel amount + other expense)
  total_expense := COALESCE(NEW.diesel_amount, 0) + COALESCE(NEW.other_expense, 0);
  
  -- Only create transaction if there's an expense
  IF total_expense > 0 THEN
    -- Check if transaction already exists for this entry
    SELECT id INTO existing_transaction_id
    FROM transactions
    WHERE type = 'bus_expense'
      AND date = NEW.entry_date
      AND bus_number = NEW.bus_name
      AND notes LIKE '%Bus Daily Entry: ' || NEW.id::text || '%'
    LIMIT 1;
    
    IF existing_transaction_id IS NOT NULL THEN
      -- Update existing transaction
      UPDATE transactions
      SET 
        amount = total_expense,
        expense_type = CASE 
          WHEN NEW.diesel_amount > 0 AND NEW.other_expense > 0 THEN 'Diesel'
          WHEN NEW.diesel_amount > 0 THEN 'Diesel'
          WHEN NEW.other_expense > 0 THEN 'Other'
          ELSE 'Other'
        END,
        vendor = COALESCE(NEW.expense_description, 'Daily Bus Operation'),
        notes = 'Bus Daily Entry: ' || NEW.id::text || 
                CASE WHEN NEW.expense_description IS NOT NULL THEN ' - ' || NEW.expense_description ELSE '' END,
        updated_at = NOW()
      WHERE id = existing_transaction_id;
    ELSE
      -- Create new transaction
      INSERT INTO transactions (
        type,
        date,
        amount,
        payment_mode,
        bus_number,
        bus_route,
        expense_type,
        vendor,
        notes
      ) VALUES (
        'bus_expense',
        NEW.entry_date,
        total_expense,
        'Cash', -- Default payment mode, can be updated later
        NEW.bus_name,
        NULL, -- Route can be set from settings if needed
        CASE 
          WHEN NEW.diesel_amount > 0 AND NEW.other_expense > 0 THEN 'Diesel'
          WHEN NEW.diesel_amount > 0 THEN 'Diesel'
          WHEN NEW.other_expense > 0 THEN 'Other'
          ELSE 'Other'
        END,
        COALESCE(NEW.expense_description, 'Daily Bus Operation'),
        'Bus Daily Entry: ' || NEW.id::text || 
        CASE WHEN NEW.expense_description IS NOT NULL THEN ' - ' || NEW.expense_description ELSE '' END
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
DROP TRIGGER IF EXISTS trigger_create_bus_expense_on_insert ON bus_daily_entries;
CREATE TRIGGER trigger_create_bus_expense_on_insert
  AFTER INSERT ON bus_daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION create_bus_expense_transaction();

-- Create trigger for UPDATE
DROP TRIGGER IF EXISTS trigger_create_bus_expense_on_update ON bus_daily_entries;
CREATE TRIGGER trigger_create_bus_expense_on_update
  AFTER UPDATE ON bus_daily_entries
  FOR EACH ROW
  WHEN (OLD.diesel_amount IS DISTINCT FROM NEW.diesel_amount OR 
        OLD.other_expense IS DISTINCT FROM NEW.other_expense OR
        OLD.entry_date IS DISTINCT FROM NEW.entry_date)
  EXECUTE FUNCTION create_bus_expense_transaction();

-- Function to delete bus expense transaction when daily entry is deleted
CREATE OR REPLACE FUNCTION delete_bus_expense_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete related transaction
  DELETE FROM transactions
  WHERE type = 'bus_expense'
    AND date = OLD.entry_date
    AND bus_number = OLD.bus_name
    AND notes LIKE '%Bus Daily Entry: ' || OLD.id::text || '%';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for DELETE
DROP TRIGGER IF EXISTS trigger_delete_bus_expense_on_delete ON bus_daily_entries;
CREATE TRIGGER trigger_delete_bus_expense_on_delete
  AFTER DELETE ON bus_daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION delete_bus_expense_transaction();

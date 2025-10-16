-- Supabase database schema for Maktoub Interest Registrations
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS interest_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest_type TEXT NOT NULL,
  other_details TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interest_registrations_email ON interest_registrations(email);
CREATE INDEX IF NOT EXISTS idx_interest_registrations_created_at ON interest_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interest_registrations_interest_type ON interest_registrations(interest_type);

-- Enable Row Level Security (RLS)
ALTER TABLE interest_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for form submission)
CREATE POLICY "Allow anonymous inserts" ON interest_registrations
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all records (for admin access)
CREATE POLICY "Allow authenticated reads" ON interest_registrations
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Optional: Create a view for analytics (without sensitive data)
CREATE OR REPLACE VIEW interest_analytics AS
SELECT 
  interest_type,
  COUNT(*) as registration_count,
  DATE_TRUNC('day', created_at) as registration_date
FROM interest_registrations
GROUP BY interest_type, DATE_TRUNC('day', created_at)
ORDER BY registration_date DESC, registration_count DESC;

-- Grant access to the view for authenticated users
GRANT SELECT ON interest_analytics TO authenticated;
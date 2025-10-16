-- Fix Row Level Security policies for Maktoub Interest Registrations
-- Run this SQL in your Supabase SQL Editor

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous inserts" ON interest_registrations;
DROP POLICY IF EXISTS "Allow authenticated reads" ON interest_registrations;

-- Create policy to allow inserts from the anon role (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON interest_registrations
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all records (for admin access)
CREATE POLICY "Allow authenticated reads" ON interest_registrations
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Verify RLS is enabled
ALTER TABLE interest_registrations ENABLE ROW LEVEL SECURITY;

-- Complete RLS fix for Maktoub Interest Registrations
-- Run this entire SQL in your Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE interest_registrations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON interest_registrations;
DROP POLICY IF EXISTS "Allow authenticated reads" ON interest_registrations;

-- Re-enable RLS
ALTER TABLE interest_registrations ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for INSERT (allows all roles including anon)
CREATE POLICY "Enable insert for all users" 
ON interest_registrations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policy for SELECT (only authenticated users can read)
CREATE POLICY "Enable read for authenticated users only" 
ON interest_registrations 
FOR SELECT 
TO authenticated
USING (true);

-- Verify the setup
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'interest_registrations';

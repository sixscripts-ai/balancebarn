-- Migration: enable_rls_and_policies
-- Created at: 1761691801

-- Enable RLS on tables
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Contact forms policies (allow anyone to insert, only authenticated users to read)
CREATE POLICY "Allow public to submit contact forms" ON contact_forms
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));

CREATE POLICY "Allow authenticated users to view contact forms" ON contact_forms
  FOR SELECT
  USING (auth.role() IN ('authenticated', 'service_role'));

-- Analytics events policies (allow anyone to track events)
CREATE POLICY "Allow public to insert analytics events" ON analytics_events
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));

CREATE POLICY "Allow authenticated users to view analytics" ON analytics_events
  FOR SELECT
  USING (auth.role() IN ('authenticated', 'service_role'));;
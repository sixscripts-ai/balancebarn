-- Migration: enable_rls_and_create_policies
-- Created at: 1761708170

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tx_county_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;

-- clients table policies
CREATE POLICY "Allow public read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow insert via edge function clients" ON clients FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));
CREATE POLICY "Allow update via edge function clients" ON clients FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- client_files table policies
CREATE POLICY "Allow public read client_files" ON client_files FOR SELECT USING (true);
CREATE POLICY "Allow insert via edge function client_files" ON client_files FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));
CREATE POLICY "Allow update via edge function client_files" ON client_files FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- processed_data table policies
CREATE POLICY "Allow public read processed_data" ON processed_data FOR SELECT USING (true);
CREATE POLICY "Allow insert via edge function processed_data" ON processed_data FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- tx_county_rates table policies (read-only for public)
CREATE POLICY "Allow public read tx_county_rates" ON tx_county_rates FOR SELECT USING (true);

-- dashboard_configs table policies
CREATE POLICY "Allow public read dashboard_configs" ON dashboard_configs FOR SELECT USING (true);
CREATE POLICY "Allow insert via edge function dashboard_configs" ON dashboard_configs FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));
CREATE POLICY "Allow update via edge function dashboard_configs" ON dashboard_configs FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));;
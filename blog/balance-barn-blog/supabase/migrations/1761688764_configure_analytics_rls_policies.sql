-- Migration: configure_analytics_rls_policies
-- Created at: 1761688764

-- Enable RLS on analytics tables
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_traffic_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_keywords ENABLE ROW LEVEL SECURITY;

-- Page Views Policies
CREATE POLICY "Allow public insert page views" ON analytics_page_views
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin read page views" ON analytics_page_views
  FOR SELECT
  USING (auth.role() IN ('anon', 'service_role'));

-- Daily Stats Policies
CREATE POLICY "Admin read daily stats" ON analytics_daily_stats
  FOR SELECT
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update daily stats" ON analytics_daily_stats
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert daily stats" ON analytics_daily_stats
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Traffic Sources Policies
CREATE POLICY "Admin read traffic sources" ON analytics_traffic_sources
  FOR SELECT
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert traffic sources" ON analytics_traffic_sources
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update traffic sources" ON analytics_traffic_sources
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

-- Keywords Policies
CREATE POLICY "Admin read keywords" ON analytics_keywords
  FOR SELECT
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow insert keywords" ON analytics_keywords
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update keywords" ON analytics_keywords
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

-- Create indexes for better query performance
CREATE INDEX idx_page_views_post_id ON analytics_page_views(post_id);
CREATE INDEX idx_page_views_created_at ON analytics_page_views(created_at DESC);
CREATE INDEX idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX idx_daily_stats_post_id ON analytics_daily_stats(post_id);
CREATE INDEX idx_daily_stats_date ON analytics_daily_stats(stat_date DESC);
CREATE INDEX idx_traffic_sources_date ON analytics_traffic_sources(stat_date DESC);
CREATE INDEX idx_keywords_post_id ON analytics_keywords(post_id);;
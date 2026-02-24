CREATE TABLE analytics_traffic_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID,
    source_type TEXT NOT NULL,
    source_name TEXT,
    stat_date DATE NOT NULL,
    visits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
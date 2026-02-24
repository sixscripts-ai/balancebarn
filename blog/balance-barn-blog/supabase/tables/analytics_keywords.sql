CREATE TABLE analytics_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL,
    post_id UUID,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5,2) DEFAULT 0,
    avg_position DECIMAL(5,2),
    last_updated TIMESTAMPTZ DEFAULT now()
);
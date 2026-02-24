CREATE TABLE analytics_daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID,
    stat_date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id,
    stat_date)
);
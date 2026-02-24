CREATE TABLE analytics_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID,
    session_id TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    time_on_page INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);
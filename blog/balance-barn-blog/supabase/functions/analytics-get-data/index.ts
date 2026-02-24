Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Read parameters from request body
        const requestData = await req.json();
        const days = requestData.days || 30;
        const postId = requestData.post_id;

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Fetch daily stats
        let dailyStatsQuery = `${supabaseUrl}/rest/v1/analytics_daily_stats?stat_date=gte.${startDateStr}&stat_date=lte.${endDateStr}&order=stat_date.asc`;
        if (postId) {
            dailyStatsQuery += `&post_id=eq.${postId}`;
        }

        const dailyStatsResponse = await fetch(dailyStatsQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const dailyStats = await dailyStatsResponse.json();

        // Fetch traffic sources
        let trafficQuery = `${supabaseUrl}/rest/v1/analytics_traffic_sources?stat_date=gte.${startDateStr}&stat_date=lte.${endDateStr}`;
        if (postId) {
            trafficQuery += `&post_id=eq.${postId}`;
        }

        const trafficResponse = await fetch(trafficQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const trafficSources = await trafficResponse.json();

        // Fetch device breakdown from page views
        let deviceQuery = `${supabaseUrl}/rest/v1/analytics_page_views?created_at=gte.${startDate.toISOString()}&select=device_type`;
        if (postId) {
            deviceQuery += `&post_id=eq.${postId}`;
        }

        const deviceResponse = await fetch(deviceQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const deviceData = await deviceResponse.json();

        // Aggregate device types
        const deviceBreakdown = deviceData.reduce((acc, view) => {
            const device = view.device_type || 'desktop';
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {});

        // Fetch top keywords
        let keywordsQuery = `${supabaseUrl}/rest/v1/analytics_keywords?order=clicks.desc&limit=10`;
        if (postId) {
            keywordsQuery += `&post_id=eq.${postId}`;
        }

        const keywordsResponse = await fetch(keywordsQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const keywords = await keywordsResponse.json();

        // Calculate totals
        const totalViews = dailyStats.reduce((sum, stat) => sum + stat.total_views, 0);
        const totalUniqueVisitors = dailyStats.reduce((sum, stat) => sum + stat.unique_visitors, 0);
        const avgTimeOnPage = dailyStats.length > 0 
            ? Math.round(dailyStats.reduce((sum, stat) => sum + stat.avg_time_on_page, 0) / dailyStats.length)
            : 0;

        // Aggregate traffic sources
        const trafficByType = trafficSources.reduce((acc, source) => {
            const type = source.source_type || 'direct';
            acc[type] = (acc[type] || 0) + source.visits;
            return acc;
        }, {});

        return new Response(JSON.stringify({
            data: {
                overview: {
                    totalViews,
                    totalUniqueVisitors,
                    avgTimeOnPage,
                    dateRange: { start: startDateStr, end: endDateStr }
                },
                dailyStats,
                trafficSources: trafficByType,
                deviceBreakdown,
                keywords,
                trend: dailyStats.map(stat => ({
                    date: stat.stat_date,
                    views: stat.total_views,
                    visitors: stat.unique_visitors
                }))
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get analytics error:', error);

        const errorResponse = {
            error: {
                code: 'GET_ANALYTICS_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

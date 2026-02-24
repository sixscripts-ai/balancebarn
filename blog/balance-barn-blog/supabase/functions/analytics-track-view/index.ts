Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

        const { post_id, session_id, user_agent, referrer, device_type, browser, os, country, city, utm_source, utm_medium, utm_campaign } = await req.json();

        if (!post_id || !session_id) {
            throw new Error('post_id and session_id are required');
        }

        // Insert page view event
        const pageViewData = {
            post_id,
            session_id,
            user_agent: user_agent || null,
            referrer: referrer || null,
            device_type: device_type || 'desktop',
            browser: browser || null,
            os: os || null,
            country: country || null,
            city: city || null,
            utm_source: utm_source || null,
            utm_medium: utm_medium || null,
            utm_campaign: utm_campaign || null,
            time_on_page: 0
        };

        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/analytics_page_views`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(pageViewData)
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            throw new Error(`Insert page view failed: ${errorText}`);
        }

        const pageView = await insertResponse.json();

        // Update or insert daily stats
        const today = new Date().toISOString().split('T')[0];
        
        // Check if daily stat exists
        const checkResponse = await fetch(
            `${supabaseUrl}/rest/v1/analytics_daily_stats?post_id=eq.${post_id}&stat_date=eq.${today}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const existingStats = await checkResponse.json();

        if (existingStats && existingStats.length > 0) {
            // Update existing stat
            const stat = existingStats[0];
            await fetch(
                `${supabaseUrl}/rest/v1/analytics_daily_stats?id=eq.${stat.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        total_views: stat.total_views + 1
                    })
                }
            );
        } else {
            // Create new stat
            await fetch(`${supabaseUrl}/rest/v1/analytics_daily_stats`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id,
                    stat_date: today,
                    total_views: 1,
                    unique_visitors: 1
                })
            });
        }

        // Track traffic source
        const source_type = utm_source || (referrer ? 'referral' : 'direct');
        const source_name = utm_source || (referrer ? new URL(referrer).hostname : 'direct');

        await fetch(`${supabaseUrl}/rest/v1/analytics_traffic_sources`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id,
                source_type,
                source_name,
                stat_date: today,
                visits: 1
            })
        });

        return new Response(JSON.stringify({ 
            success: true,
            data: pageView[0]
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Track page view error:', error);

        const errorResponse = {
            error: {
                code: 'TRACK_VIEW_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

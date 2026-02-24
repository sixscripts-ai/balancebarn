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

        const now = new Date().toISOString();

        // Find all scheduled posts that are due to be published
        const getScheduledResponse = await fetch(
            `${supabaseUrl}/rest/v1/blog_posts?status=eq.scheduled&scheduled_for=lte.${now}&select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        if (!getScheduledResponse.ok) {
            throw new Error('Failed to fetch scheduled posts');
        }

        const scheduledPosts = await getScheduledResponse.json();

        if (scheduledPosts.length === 0) {
            return new Response(JSON.stringify({
                data: {
                    message: 'No scheduled posts to publish',
                    processed: 0
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Publish each scheduled post
        const publishedIds = [];
        for (const post of scheduledPosts) {
            const updateResponse = await fetch(
                `${supabaseUrl}/rest/v1/blog_posts?id=eq.${post.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'published',
                        published_at: now
                    })
                }
            );

            if (updateResponse.ok) {
                publishedIds.push(post.id);
            }
        }

        return new Response(JSON.stringify({
            data: {
                message: `Published ${publishedIds.length} scheduled posts`,
                processed: publishedIds.length,
                publishedIds
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Publish scheduled posts error:', error);

        const errorResponse = {
            error: {
                code: 'PUBLISH_SCHEDULED_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

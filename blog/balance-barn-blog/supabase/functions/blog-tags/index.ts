Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

        if (!serviceRoleKey || !supabaseUrl || !anonKey) {
            throw new Error('Supabase configuration missing');
        }

        // Extract and validate user authorization token
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Missing or invalid authorization header');
        }

        const userToken = authHeader.replace('Bearer ', '');
        
        // Validate the user token
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'apikey': anonKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid user token');
        }

        const user = await userResponse.json();
        if (!user || !user.id) {
            throw new Error('User not authenticated');
        }

        const { action, data } = await req.json();

        if (action === 'create') {
            const createResponse = await fetch(`${supabaseUrl}/rest/v1/tags`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });

            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                throw new Error(`Create failed: ${errorText}`);
            }

            const tag = await createResponse.json();
            return new Response(JSON.stringify({ data: tag[0] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'update') {
            const { id, ...updateData } = data;

            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/tags?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(updateData)
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`Update failed: ${errorText}`);
            }

            const updated = await updateResponse.json();
            return new Response(JSON.stringify({ data: updated[0] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'delete') {
            const { id } = data;

            const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/tags?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text();
                throw new Error(`Delete failed: ${errorText}`);
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'assign-to-post') {
            const { post_id, tag_id } = data;

            const assignResponse = await fetch(`${supabaseUrl}/rest/v1/post_tags`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id, tag_id })
            });

            if (!assignResponse.ok) {
                const errorText = await assignResponse.text();
                throw new Error(`Tag assignment failed: ${errorText}`);
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'remove-from-post') {
            const { post_id, tag_id } = data;

            const removeResponse = await fetch(
                `${supabaseUrl}/rest/v1/post_tags?post_id=eq.${post_id}&tag_id=eq.${tag_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                }
            );

            if (!removeResponse.ok) {
                throw new Error('Tag removal failed');
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        throw new Error('Invalid action');

    } catch (error) {
        console.error('Tags error:', error);

        const errorResponse = {
            error: {
                code: 'TAG_OPERATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

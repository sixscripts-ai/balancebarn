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
        console.log('=== BLOG POSTS FUNCTION START ===');
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

        console.log('Environment check:', {
            hasServiceRoleKey: !!serviceRoleKey,
            hasSupabaseUrl: !!supabaseUrl,
            hasAnonKey: !!anonKey,
            supabaseUrl: supabaseUrl
        });

        if (!serviceRoleKey || !supabaseUrl || !anonKey) {
            console.error('Supabase configuration missing');
            throw new Error('Supabase configuration missing');
        }

        // Extract and validate user authorization token
        const authHeader = req.headers.get('Authorization');
        console.log('Auth header check:', {
            hasAuthHeader: !!authHeader,
            authHeaderValue: authHeader ? `${authHeader.substring(0, 20)}...` : null
        });

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Missing or invalid authorization header');
            throw new Error('Missing or invalid authorization header');
        }

        const userToken = authHeader.replace('Bearer ', '');
        console.log('User token extracted:', {
            tokenLength: userToken.length,
            tokenPrefix: userToken.substring(0, 20) + '...'
        });
        
        // Validate the user token
        console.log('Validating user token with Supabase auth endpoint...');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'apikey': anonKey
            }
        });

        console.log('User validation response:', {
            status: userResponse.status,
            statusText: userResponse.statusText,
            ok: userResponse.ok
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error('User validation failed:', errorText);
            throw new Error(`Invalid user token: ${errorText}`);
        }

        const user = await userResponse.json();
        console.log('User validation result:', {
            hasUser: !!user,
            hasUserId: !!(user && user.id),
            userId: user?.id,
            userEmail: user?.email
        });

        if (!user || !user.id) {
            console.error('User not authenticated - no user or user.id');
            throw new Error('User not authenticated');
        }

        console.log('=== AUTHENTICATION SUCCESSFUL ===');

        const { action, data } = await req.json();

        if (action === 'create') {
            console.log('=== CREATE POST OPERATION ===');
            
            // Ensure scheduled_for is included in the data
            const postData = {
                ...data,
                updated_at: new Date().toISOString()
            };

            console.log('Post data prepared:', {
                dataKeys: Object.keys(postData),
                hasTitle: !!postData.title,
                hasContent: !!postData.content,
                hasAuthorId: !!postData.author_id,
                hasStatus: !!postData.status
            });

            console.log('Creating post via REST API with service role key...');
            const createResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(postData)
            });

            console.log('Create response:', {
                status: createResponse.status,
                statusText: createResponse.statusText,
                ok: createResponse.ok
            });

            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                console.error('Create failed:', errorText);
                throw new Error(`Create failed: ${errorText}`);
            }

            const post = await createResponse.json();
            console.log('Post created successfully:', {
                postId: post[0]?.id,
                postTitle: post[0]?.title
            });

            return new Response(JSON.stringify({ data: post[0] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (action === 'update') {
            const { id, ...updateData } = data;
            updateData.updated_at = new Date().toISOString();

            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
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

            const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
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

        if (action === 'increment-views') {
            const { id } = data;
            
            const getResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}&select=views`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            const posts = await getResponse.json();
            const currentViews = posts[0]?.views || 0;

            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ views: currentViews + 1 })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to increment views');
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        throw new Error('Invalid action');

    } catch (error) {
        console.error('=== BLOG POSTS ERROR ===');
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.error('=== ERROR END ===');

        const errorResponse = {
            error: {
                code: 'BLOG_OPERATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

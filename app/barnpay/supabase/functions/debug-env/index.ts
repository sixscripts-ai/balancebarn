// Debug environment variables
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const minimaxKey = Deno.env.get('MINIMAX_API_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        const envDebug = {
            minimax_key_exists: !!minimaxKey,
            minimax_key_length: minimaxKey ? minimaxKey.length : 0,
            minimax_key_preview: minimaxKey ? minimaxKey.substring(0, 20) + '...' : 'MISSING',
            supabase_url_exists: !!supabaseUrl,
            supabase_key_exists: !!supabaseKey
        };
        
        console.log('Environment Debug:', JSON.stringify(envDebug, null, 2));
        
        return new Response(JSON.stringify({
            env_debug: envDebug,
            timestamp: new Date().toISOString()
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Debug error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

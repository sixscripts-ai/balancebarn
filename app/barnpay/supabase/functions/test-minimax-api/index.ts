// Test MiniMax API directly
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
        const minimaxApiKey = Deno.env.get('MINIMAX_API_KEY')!;
        console.log('MiniMax API Key retrieved:', minimaxApiKey ? `${minimaxApiKey.length} chars` : 'MISSING');
        
        // Test different API endpoints
        const endpoints = [
            'https://api.minimax.chat/v1/chat/completions',
            'https://api.minimax.chat/v1/text/chatcompletion_v2',
            'https://api.minimax.chat/v1/text/chatcompletion_pro'
        ];
        
        for (const endpoint of endpoints) {
            console.log(`Testing endpoint: ${endpoint}`);
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${minimaxApiKey}`
                },
                body: JSON.stringify({
                    model: 'abab6.5-turbo',
                    messages: [
                        { role: 'user', content: 'Hello' }
                    ],
                    max_tokens: 50
                })
            });
            
            const responseText = await response.text();
            console.log(`${endpoint} - Status: ${response.status}`);
            console.log(`${endpoint} - Response: ${responseText}`);
            
            if (response.ok) {
                return new Response(JSON.stringify({
                    success: true,
                    endpoint: endpoint,
                    status: response.status,
                    response: responseText
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }
        
        return new Response(JSON.stringify({
            error: 'All endpoints failed',
            key_status: minimaxApiKey ? 'PRESENT' : 'MISSING',
            key_length: minimaxApiKey ? minimaxApiKey.length : 0
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Test error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

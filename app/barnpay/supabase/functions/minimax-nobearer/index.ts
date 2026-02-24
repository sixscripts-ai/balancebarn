// MiniMax API test without Bearer
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
        const { message } = await req.json();
        const apiKey = Deno.env.get('MINIMAX_API_KEY')!;
        
        console.log('Using API key length:', apiKey ? apiKey.length : 0);
        
        // Try without Bearer prefix
        const testUrl = 'https://api.minimax.chat/v1/text/chatcompletion_v2';
        const testBody = {
            model: 'abab6.5s-chat',
            messages: [
                { role: 'user', content: message || 'Hello' }
            ]
        };
        
        console.log('Request body:', JSON.stringify(testBody, null, 2));
        
        const response = await fetch(testUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey  // No Bearer prefix
            },
            body: JSON.stringify(testBody)
        });
        
        const responseText = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', responseText);
        
        return new Response(JSON.stringify({
            success: response.ok,
            status: response.status,
            response: responseText,
            headers: Object.fromEntries(response.headers.entries()),
            request: {
                url: testUrl,
                body: testBody,
                api_key_length: apiKey.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('No Bearer test error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Simple MiniMax test
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
        
        console.log('Using API key:', apiKey ? `${apiKey.length} chars` : 'MISSING');
        
        // Try different API calls
        const tests = [
            {
                name: 'Basic Chat Completions',
                url: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
                body: {
                    model: 'abab6.5s-chat',  // Try the original model name
                    messages: [
                        { role: 'user', content: message || 'Hello' }
                    ]
                }
            },
            {
                name: 'V1 Chat Completions',
                url: 'https://api.minimax.chat/v1/chat/completions',
                body: {
                    model: 'abab6.5s-chat',
                    messages: [
                        { role: 'user', content: message || 'Hello' }
                    ]
                }
            }
        ];
        
        for (const test of tests) {
            try {
                console.log(`Testing: ${test.name}`);
                
                const response = await fetch(test.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify(test.body)
                });
                
                const responseText = await response.text();
                console.log(`${test.name} - Status: ${response.status}`);
                console.log(`${test.name} - Response: ${responseText}`);
                
                if (response.ok) {
                    return new Response(JSON.stringify({
                        success: true,
                        test: test.name,
                        status: response.status,
                        response: responseText,
                        headers: Object.fromEntries(response.headers.entries())
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
                
            } catch (error) {
                console.error(`${test.name} error:`, error);
            }
        }
        
        return new Response(JSON.stringify({
            error: 'All tests failed',
            api_key_status: apiKey ? 'PRESENT' : 'MISSING'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('MiniMax simple test error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

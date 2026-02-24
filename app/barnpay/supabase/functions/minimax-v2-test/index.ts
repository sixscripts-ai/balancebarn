// Try MiniMax v2 API with different format
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
        const { message, userId } = await req.json();
        const apiKey = Deno.env.get('MINIMAX_API_KEY')!;
        
        console.log('Using API key length:', apiKey.length);
        
        // Try MiniMax v2 API format
        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'abab6.5s-chat',
                messages: [
                    { role: 'user', content: message || 'Hello' }
                ],
                temperature: 0.7,
                max_tokens: 100
            })
        });
        
        const responseText = await response.text();
        console.log('v2 API Status:', response.status);
        console.log('v2 API Response:', responseText);
        
        // Try alternative model if v2 fails
        if (!response.ok) {
            const altResponse = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'abab6.5s-chat',
                    messages: [
                        { role: 'user', content: message || 'Hello' }
                    ]
                })
            });
            
            const altResponseText = await altResponse.text();
            console.log('v1 API Status:', altResponse.status);
            console.log('v1 API Response:', altResponseText);
            
            if (altResponse.ok) {
                const data = JSON.parse(altResponseText);
                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        response: data.choices?.[0]?.message?.content || data.reply?.content || altResponseText,
                        ai_powered: true,
                        model: 'MiniMax-abab6.5s-chat'
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }
        
        return new Response(JSON.stringify({
            success: response.ok,
            data: {
                response: responseText,
                ai_powered: response.ok,
                model: 'MiniMax-abab6.5s-chat'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('v2 API test error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

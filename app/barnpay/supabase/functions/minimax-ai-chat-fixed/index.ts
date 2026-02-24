// MiniMax chat with proper format
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
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        
        console.log('Processing chat message:', message);
        
        // Get financial context if available
        let financialContext = '';
        try {
            const recentFilesResponse = await fetch(`${supabaseUrl}/rest/v1/uploaded_files?select=*&limit=1&order=created_at.desc`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            const recentFiles = await recentFilesResponse.json();
            
            if (recentFiles && recentFiles.length > 0) {
                const fileId = recentFiles[0].id;
                const metricsResponse = await fetch(`${supabaseUrl}/rest/v1/financial_metrics?file_id=eq.${fileId}&select=*`, {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`
                    }
                });
                const metricsData = await metricsResponse.json();
                
                if (metricsData && metricsData.length > 0) {
                    financialContext = buildFinancialContext(metricsData);
                }
            }
        } catch (error) {
            console.log('No financial data available for context');
        }

        // Call MiniMax API with original working format
        const aiResponse = await generateMinimaxAIResponse(message, financialContext, apiKey);
        
        // Store chat message
        try {
            await fetch(`${supabaseUrl}/rest/v1/chat_history`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    user_id: userId,
                    message: message,
                    role: 'user',
                    response: aiResponse,
                    context_data: null
                })
            });
        } catch (error) {
            console.log('Failed to store chat message:', error);
        }
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                response: aiResponse,
                ai_powered: true,
                model: 'MiniMax-abab6.5s-chat'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Chat error:', error);
        return new Response(JSON.stringify({
            error: {
                code: 'AI_CHAT_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

function buildFinancialContext(metrics: any[]): string {
    if (!metrics || metrics.length === 0) {
        return '';
    }
    
    let context = `\n\nFinancial Data Context:\n`;
    for (const metric of metrics.slice(0, 10)) {
        context += `- ${metric.metric_name}: ${metric.metric_value}\n`;
    }
    
    return context;
}

async function generateMinimaxAIResponse(userMessage: string, financialContext: string, apiKey: string): Promise<string> {
    if (!apiKey) {
        return "I'm experiencing technical issues with the AI service. Please try again.";
    }
    
    try {
        // Use the original working format
        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'abab6.5s-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful AI assistant. You can discuss financial topics and provide analysis. ${financialContext}`
                    },
                    {
                        role: 'user', 
                        content: userMessage
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('MiniMax API error:', response.status, errorText);
            return `API Error: ${response.status}. Please try again later.`;
        }
        
        const data = await response.json();
        console.log('MiniMax Response:', JSON.stringify(data));
        
        // Handle multiple response formats
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        }
        
        if (data.reply && data.reply.content) {
            return data.reply.content;
        }
        
        if (data.text) {
            return data.text;
        }
        
        if (data.data && data.data.content) {
            return data.data.content;
        }
        
        return JSON.stringify(data);
        
    } catch (error) {
        console.error('MiniMax API error:', error);
        return `Connection error: ${error.message}`;
    }
}

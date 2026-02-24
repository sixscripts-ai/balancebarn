// MiniMax AI Chat Integration - CORRECTED VERSION
// Uses MiniMax-M2 model via OpenAI-compatible API endpoint

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders
        });
    }

    try {
        const { message, userId } = await req.json();
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const minimaxApiKey = Deno.env.get('MINIMAX_API_KEY')!;
        
        // Get financial context if available (optional enhancement)
        let financialContext = '';
        try {
            // Try to get recent financial data for context (but don't require it)
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
            // Continue without financial context - this is optional
            console.log('No financial data available for context');
        }

        // Generate AI response using corrected MiniMax API
        const aiResponse = await generateMinimaxAIResponse(message, financialContext, minimaxApiKey);
        
        // Store chat message
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
        
        return new Response(JSON.stringify({
            success: true,
            data: {
                response: aiResponse,
                ai_powered: true,
                model: 'MiniMax-M2'
            }
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('MiniMax AI Chat error:', error);
        return new Response(JSON.stringify({
            error: {
                code: 'AI_CHAT_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
});

function buildFinancialContext(metrics: any[]): string {
    if (!metrics || metrics.length === 0) {
        return '';
    }
    
    let context = `\n\nFinancial Data Context (optional):\n`;
    for (const metric of metrics.slice(0, 10)) {
        context += `- ${metric.metric_name}: ${metric.metric_value}\n`;
    }
    context += `You can reference this financial data if relevant to the user's question.`;
    
    return context;
}

async function generateMinimaxAIResponse(userMessage: string, financialContext: string, apiKey: string): Promise<string> {
    if (!apiKey) {
        return "I'm currently experiencing technical issues. Please ensure your MINIMAX_API_KEY environment variable is set.";
    }
    
    try {
        // CORRECTED: MiniMax OpenAI-compatible endpoint and model
        const response = await fetch('https://api.minimax.io/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'MiniMax-M2',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful, intelligent AI assistant for financial analysis. You can discuss a wide variety of financial topics and provide helpful, accurate information. If the user asks about financial analysis or QuickBooks data, you can help with that too. Be conversational, helpful, and informative.

You're part of a financial dashboard application, so you have access to financial analysis capabilities${financialContext}.`
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 0.95,
                stream: false
                // Removed MiniMax-specific parameters - using OpenAI-compatible format
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('MiniMax API error:', response.status, errorText);
            throw new Error(`MiniMax API request failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('MiniMax API Response:', JSON.stringify(data, null, 2));
        
        // Standard OpenAI-compatible response format
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }
        
        // Fallback response formats
        if (data.reply && data.reply.content) {
            return data.reply.content;
        }
        
        if (data.text) {
            return data.text;
        }
        
        if (data.data && data.data.content) {
            return data.data.content;
        }
        
        // Last resort - return raw data for debugging
        return `Raw API Response: ${JSON.stringify(data)}`;
        
    } catch (error) {
        console.error('MiniMax API error:', error);
        // Enhanced fallback response
        return `AI Error: ${error.message}. Please check your MiniMax API key and configuration.`;
    }
}
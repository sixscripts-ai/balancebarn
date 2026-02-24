Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { message, userId, fileId } = await req.json();
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        
        // Get file processing results and metrics
        let contextData: any = {};
        
        if (fileId) {
            // Fetch file data
            const fileResponse = await fetch(`${supabaseUrl}/rest/v1/uploaded_files?id=eq.${fileId}&select=*`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            const fileData = await fileResponse.json();
            
            // Fetch metrics
            const metricsResponse = await fetch(`${supabaseUrl}/rest/v1/financial_metrics?file_id=eq.${fileId}&select=*`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            const metricsData = await metricsResponse.json();
            
            contextData = {
                file: fileData[0] || {},
                metrics: metricsData || []
            };
        }
        
        // Build context for AI
        const systemContext = buildSystemContext(contextData);
        
        // Generate AI response
        const aiResponse = await generateAIResponse(message, systemContext);
        
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
                context_data: contextData
            })
        });
        
        return new Response(JSON.stringify({ 
            success: true,
            data: {
                response: aiResponse,
                context: contextData
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
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

function buildSystemContext(contextData: any) {
    if (!contextData.file || !contextData.metrics) {
        return 'No financial data available yet. Please upload a QuickBooks file first.';
    }
    
    const results = contextData.file.processing_results || {};
    const metrics = contextData.metrics || [];
    
    let context = `Financial Data Analysis Context:\n\n`;
    context += `File: ${contextData.file.filename}\n`;
    context += `Transactions Processed: ${results.transaction_count || 0}\n\n`;
    
    if (results.metrics) {
        context += `Basic Metrics:\n`;
        context += `- Total Revenue: $${results.metrics.totalRevenue?.toFixed(2) || 0}\n`;
        context += `- Total Expenses: $${results.metrics.totalExpenses?.toFixed(2) || 0}\n`;
        context += `- Net Income: $${results.metrics.netIncome?.toFixed(2) || 0}\n`;
        context += `- Profit Margin: ${results.metrics.profitMargin?.toFixed(2) || 0}%\n`;
        context += `- Accounts Receivable: $${results.metrics.accountsReceivable?.toFixed(2) || 0}\n`;
        context += `- Accounts Payable: $${results.metrics.accountsPayable?.toFixed(2) || 0}\n\n`;
    }
    
    if (metrics.length > 0) {
        context += `Advanced Metrics:\n`;
        for (const metric of metrics) {
            context += `- ${metric.metric_name}: ${metric.metric_value}\n`;
            if (metric.metric_data) {
                const data = metric.metric_data;
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'number') {
                        context += `  ${key}: ${data[key].toFixed(2)}\n`;
                    } else {
                        context += `  ${key}: ${data[key]}\n`;
                    }
                });
            }
        }
    }
    
    return context;
}

async function generateAIResponse(userMessage: string, systemContext: string): Promise<string> {
    // Check if we have actual data
    if (systemContext.includes('No financial data available')) {
        return "I don't have any financial data to analyze yet. Please upload a QuickBooks CSV file first using the Files section, and I'll be able to provide detailed insights about your financial data.";
    }
    
    // Analyze the question and generate appropriate response
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('revenue') || lowerMessage.includes('income')) {
        return analyzeRevenue(systemContext);
    } else if (lowerMessage.includes('expense') || lowerMessage.includes('cost')) {
        return analyzeExpenses(systemContext);
    } else if (lowerMessage.includes('cash') || lowerMessage.includes('flow')) {
        return analyzeCashFlow(systemContext);
    } else if (lowerMessage.includes('profit') || lowerMessage.includes('margin')) {
        return analyzeProfitability(systemContext);
    } else if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
        return provideSummary(systemContext);
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('improve')) {
        return provideRecommendations(systemContext);
    } else {
        return provideSummary(systemContext);
    }
}

function analyzeRevenue(context: string): string {
    const revenueMatch = context.match(/Total Revenue: \$([0-9,.]+)/);
    const revenue = revenueMatch ? parseFloat(revenueMatch[1].replace(/,/g, '')) : 0;
    
    return `Based on your financial data, your total revenue is $${revenue.toFixed(2)}. This represents the total income generated from your services.\n\nKey insights:\n- Revenue streams are primarily from service invoices\n- Consider diversifying income sources for better stability\n- Monitor accounts receivable closely to ensure timely collections\n\nWould you like me to analyze your revenue trends in more detail?`;
}

function analyzeExpenses(context: string): string {
    const expensesMatch = context.match(/Total Expenses: \$([0-9,.]+)/);
    const expenses = expensesMatch ? parseFloat(expensesMatch[1].replace(/,/g, '')) : 0;
    
    return `Your total expenses amount to $${expenses.toFixed(2)}. Managing expenses is crucial for profitability.\n\nObservations:\n- Major expense categories include rent, utilities, software, and contractor payments\n- Look for opportunities to negotiate better rates with vendors\n- Consider early payment discounts where available\n\nI can help you identify specific areas for cost optimization. What would you like to explore?`;
}

function analyzeCashFlow(context: string): string {
    const cashFlowMatch = context.match(/daysUntilShortfall[":]+\s*([0-9-]+)/);
    const days = cashFlowMatch ? parseInt(cashFlowMatch[1]) : 0;
    
    if (days > 0) {
        return `Your cash flow position shows approximately ${days} days until potential cash shortfall based on current burn rate.\n\nRecommendations:\n- Monitor accounts receivable aging closely\n- Consider establishing a line of credit as a safety net\n- Review payment terms with clients to improve cash collection\n- Identify opportunities to reduce monthly burn rate\n\nWould you like me to analyze your accounts receivable in detail?`;
    } else {
        return `Your cash flow analysis indicates a healthy financial position. Continue monitoring closely to maintain this status.\n\nBest practices:\n- Maintain current collection efforts\n- Build cash reserves for seasonal variations\n- Review vendor payment terms regularly`;
    }
}

function analyzeProfitability(context: string): string {
    const profitMarginMatch = context.match(/Profit Margin: ([0-9.]+)%/);
    const margin = profitMarginMatch ? parseFloat(profitMarginMatch[1]) : 0;
    
    return `Your profit margin is ${margin.toFixed(2)}%, which is ${margin > 20 ? 'healthy' : 'below typical service industry standards'}.\n\nTo improve profitability:\n- Review pricing strategy - consider value-based pricing\n- Reduce uncategorized expenses that contribute to profit leakage\n- Optimize vendor payments to capture early payment discounts\n- Improve operational efficiency to reduce overhead\n\nI can help you identify specific profit leakage areas. Would you like to see a detailed analysis?`;
}

function provideSummary(context: string): string {
    const revenueMatch = context.match(/Total Revenue: \$([0-9,.]+)/);
    const expensesMatch = context.match(/Total Expenses: \$([0-9,.]+)/);
    const netIncomeMatch = context.match(/Net Income: \$([0-9,.]+)/);
    
    const revenue = revenueMatch ? parseFloat(revenueMatch[1].replace(/,/g, '')) : 0;
    const expenses = expensesMatch ? parseFloat(expensesMatch[1].replace(/,/g, '')) : 0;
    const netIncome = netIncomeMatch ? parseFloat(netIncomeMatch[1].replace(/,/g, '')) : 0;
    
    return `Here's a comprehensive summary of your financial health:\n\nFinancial Overview:\n- Total Revenue: $${revenue.toFixed(2)}\n- Total Expenses: $${expenses.toFixed(2)}\n- Net Income: $${netIncome.toFixed(2)}\n- Profit Margin: ${revenue > 0 ? ((netIncome / revenue) * 100).toFixed(2) : 0}%\n\nKey Findings:\n- Your business is ${netIncome > 0 ? 'profitable' : 'operating at a loss'}\n- ${netIncome > 0 ? 'Focus on scaling operations while maintaining margins' : 'Immediate action needed to improve profitability'}\n- Cash flow management is critical for sustainability\n\nNext Steps:\n- Review detailed metrics in the MyDash section\n- Upload more recent data for trend analysis\n- Ask me specific questions about any metric\n\nWhat aspect of your finances would you like to explore further?`;
}

function provideRecommendations(context: string): string {
    return `Based on your financial data, here are my top recommendations:\n\n1. Cash Flow Management:\n   - Implement stricter accounts receivable collection policies\n   - Consider offering early payment incentives to clients\n   - Negotiate extended payment terms with vendors\n\n2. Expense Optimization:\n   - Review and eliminate duplicate or unused software subscriptions\n   - Negotiate better rates with frequent vendors\n   - Categorize all miscellaneous expenses properly\n\n3. Revenue Growth:\n   - Analyze your most profitable service offerings\n   - Consider value-based pricing for premium services\n   - Develop recurring revenue streams\n\n4. Operational Efficiency:\n   - Automate routine bookkeeping tasks\n   - Implement regular financial review cycles\n   - Use predictive analytics for better planning\n\nI can provide detailed analysis for any of these areas. Which would you like to explore first?`;
}

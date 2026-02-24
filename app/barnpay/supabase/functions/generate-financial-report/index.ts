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
        const { fileId, reportType } = await req.json();
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        
        // Fetch file and metrics data
        const fileResponse = await fetch(`${supabaseUrl}/rest/v1/uploaded_files?id=eq.${fileId}&select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const fileData = await fileResponse.json();
        
        const metricsResponse = await fetch(`${supabaseUrl}/rest/v1/financial_metrics?file_id=eq.${fileId}&select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const metricsData = await metricsResponse.json();
        
        // Generate report based on type
        let report;
        switch (reportType) {
            case 'comprehensive':
                report = generateComprehensiveReport(fileData[0], metricsData);
                break;
            case 'executive-summary':
                report = generateExecutiveSummary(fileData[0], metricsData);
                break;
            case 'cash-flow':
                report = generateCashFlowReport(fileData[0], metricsData);
                break;
            case 'profitability':
                report = generateProfitabilityReport(fileData[0], metricsData);
                break;
            default:
                report = generateComprehensiveReport(fileData[0], metricsData);
        }
        
        return new Response(JSON.stringify({ 
            success: true,
            data: report
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            error: {
                code: 'REPORT_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

function generateComprehensiveReport(file: any, metrics: any[]) {
    const results = file.processing_results || {};
    const basicMetrics = results.metrics || {};
    
    return {
        title: 'Comprehensive Financial Analysis Report',
        generated_at: new Date().toISOString(),
        file_name: file.filename,
        sections: [
            {
                title: 'Executive Summary',
                content: generateExecutiveSummaryContent(basicMetrics, metrics)
            },
            {
                title: 'Revenue Analysis',
                content: generateRevenueAnalysis(basicMetrics)
            },
            {
                title: 'Expense Breakdown',
                content: generateExpenseAnalysis(basicMetrics)
            },
            {
                title: 'Profitability Assessment',
                content: generateProfitabilityAnalysis(basicMetrics)
            },
            {
                title: 'Cash Flow Position',
                content: generateCashFlowAnalysis(metrics)
            },
            {
                title: 'Key Performance Indicators',
                content: generateKPIAnalysis(metrics)
            },
            {
                title: 'Recommendations',
                content: generateRecommendations(basicMetrics, metrics)
            }
        ]
    };
}

function generateExecutiveSummary(file: any, metrics: any[]) {
    const results = file.processing_results || {};
    const basicMetrics = results.metrics || {};
    
    return {
        title: 'Executive Summary Report',
        generated_at: new Date().toISOString(),
        file_name: file.filename,
        sections: [
            {
                title: 'Financial Highlights',
                content: generateExecutiveSummaryContent(basicMetrics, metrics)
            },
            {
                title: 'Critical Metrics',
                content: generateCriticalMetrics(metrics)
            },
            {
                title: 'Action Items',
                content: generateActionItems(basicMetrics, metrics)
            }
        ]
    };
}

function generateCashFlowReport(file: any, metrics: any[]) {
    const results = file.processing_results || {};
    const basicMetrics = results.metrics || {};
    
    return {
        title: 'Cash Flow Analysis Report',
        generated_at: new Date().toISOString(),
        file_name: file.filename,
        sections: [
            {
                title: 'Cash Flow Overview',
                content: generateCashFlowAnalysis(metrics)
            },
            {
                title: 'Accounts Receivable Analysis',
                content: generateARAnalysis(basicMetrics)
            },
            {
                title: 'Accounts Payable Analysis',
                content: generateAPAnalysis(basicMetrics)
            },
            {
                title: 'Working Capital Assessment',
                content: generateWorkingCapitalAnalysis(basicMetrics)
            }
        ]
    };
}

function generateProfitabilityReport(file: any, metrics: any[]) {
    const results = file.processing_results || {};
    const basicMetrics = results.metrics || {};
    
    return {
        title: 'Profitability Analysis Report',
        generated_at: new Date().toISOString(),
        file_name: file.filename,
        sections: [
            {
                title: 'Profit & Loss Summary',
                content: generateProfitabilityAnalysis(basicMetrics)
            },
            {
                title: 'Profit Margin Analysis',
                content: generateMarginAnalysis(basicMetrics)
            },
            {
                title: 'Profit Leakage Assessment',
                content: generateProfitLeakageAnalysis(metrics)
            },
            {
                title: 'Optimization Opportunities',
                content: generateOptimizationOpportunities(metrics)
            }
        ]
    };
}

function generateExecutiveSummaryContent(basicMetrics: any, metrics: any[]) {
    const revenue = basicMetrics.totalRevenue || 0;
    const expenses = basicMetrics.totalExpenses || 0;
    const netIncome = basicMetrics.netIncome || 0;
    const profitMargin = basicMetrics.profitMargin || 0;
    
    return `
Financial Performance Overview:

Total Revenue: $${revenue.toFixed(2)}
Total Expenses: $${expenses.toFixed(2)}
Net Income: $${netIncome.toFixed(2)}
Profit Margin: ${profitMargin.toFixed(2)}%

Status: ${netIncome > 0 ? 'Profitable' : 'Loss Making'}
Health Rating: ${profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Good' : profitMargin > 0 ? 'Fair' : 'Critical'}

Key Findings:
- ${netIncome > 0 ? 'Business is generating positive returns' : 'Immediate action required to improve profitability'}
- Profit margin is ${profitMargin > 20 ? 'above' : profitMargin > 10 ? 'at' : 'below'} industry standards
- ${metrics.length} advanced metrics calculated for detailed analysis
`;
}

function generateRevenueAnalysis(basicMetrics: any) {
    const revenue = basicMetrics.totalRevenue || 0;
    
    return `
Revenue Performance:

Total Revenue Generated: $${revenue.toFixed(2)}

Analysis:
- Primary revenue source: Service invoices
- Revenue recognition: Point-in-time basis
- Collection status: Review accounts receivable aging

Opportunities:
- Implement recurring revenue models
- Develop tiered service packages
- Consider retainer-based contracts
- Expand service offerings
`;
}

function generateExpenseAnalysis(basicMetrics: any) {
    const expenses = basicMetrics.totalExpenses || 0;
    
    return `
Expense Analysis:

Total Expenses: $${expenses.toFixed(2)}

Major Categories:
- Operating expenses (rent, utilities)
- Labor costs (contractors, payroll)
- Software and technology
- Professional services

Cost Management Recommendations:
- Review all subscription services
- Negotiate vendor contracts
- Implement expense approval workflows
- Track expense trends monthly
`;
}

function generateProfitabilityAnalysis(basicMetrics: any) {
    const netIncome = basicMetrics.netIncome || 0;
    const profitMargin = basicMetrics.profitMargin || 0;
    
    return `
Profitability Assessment:

Net Income: $${netIncome.toFixed(2)}
Profit Margin: ${profitMargin.toFixed(2)}%

Performance Rating: ${profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Good' : profitMargin > 0 ? 'Fair' : 'Critical'}

Industry Comparison:
- Service industry average: 15-25%
- Your performance: ${profitMargin > 15 ? 'Above average' : profitMargin > 10 ? 'Average' : 'Below average'}

Improvement Strategies:
- Optimize pricing strategy
- Reduce cost of service delivery
- Eliminate profit leakage
- Improve operational efficiency
`;
}

function generateCashFlowAnalysis(metrics: any[]) {
    const cashFlowMetric = metrics.find(m => m.metric_name === 'Cash Flow Gap Predictor');
    const data = cashFlowMetric?.metric_data || {};
    
    return `
Cash Flow Position:

Days Until Potential Shortfall: ${data.daysUntilShortfall || 'N/A'}
Current Assets: $${(data.currentAssets || 0).toFixed(2)}
Current Liabilities: $${(data.currentLiabilities || 0).toFixed(2)}
Net Position: $${(data.netPosition || 0).toFixed(2)}

Assessment: ${data.daysUntilShortfall > 90 ? 'Healthy' : data.daysUntilShortfall > 30 ? 'Monitor Closely' : 'Critical Attention Required'}

Recommendations:
- ${data.daysUntilShortfall < 30 ? 'Immediate action required to improve cash position' : 'Maintain current collection efforts'}
- Monitor accounts receivable aging weekly
- Review payment terms with clients
- Consider establishing credit facility
`;
}

function generateKPIAnalysis(metrics: any[]) {
    let content = 'Key Performance Indicators:\n\n';
    
    for (const metric of metrics) {
        content += `${metric.metric_name}: ${metric.metric_value}\n`;
        if (metric.metric_data) {
            content += `  Category: ${metric.metric_category}\n`;
        }
        content += '\n';
    }
    
    return content;
}

function generateCriticalMetrics(metrics: any[]) {
    return `
Critical Metrics Requiring Attention:

${metrics.filter(m => m.metric_category === 'cash_flow' || m.metric_category === 'quality').map(m => 
    `- ${m.metric_name}: ${m.metric_value}`
).join('\n')}

These metrics indicate areas needing immediate focus.
`;
}

function generateActionItems(basicMetrics: any, metrics: any[]) {
    const profitMargin = basicMetrics.profitMargin || 0;
    
    return `
Immediate Action Items:

Priority 1 (Urgent):
${profitMargin < 10 ? '- Improve profit margins through pricing review' : '- Maintain current profitability levels'}
- Review cash flow forecast weekly
- Update accounts receivable aging report

Priority 2 (Important):
- Implement expense categorization improvements
- Review vendor payment terms
- Establish financial KPI dashboard

Priority 3 (Ongoing):
- Monthly financial review meetings
- Quarterly strategic planning sessions
- Annual budget planning and review
`;
}

function generateARAnalysis(basicMetrics: any) {
    const ar = basicMetrics.accountsReceivable || 0;
    
    return `
Accounts Receivable Analysis:

Outstanding Balance: $${ar.toFixed(2)}

Recommendations:
- Implement 30-day payment terms
- Send invoices immediately upon service completion
- Follow up on overdue accounts weekly
- Consider offering early payment incentives
`;
}

function generateAPAnalysis(basicMetrics: any) {
    const ap = basicMetrics.accountsPayable || 0;
    
    return `
Accounts Payable Analysis:

Current Payables: $${ap.toFixed(2)}

Management Strategy:
- Take advantage of vendor early payment discounts
- Negotiate extended payment terms where possible
- Maintain good vendor relationships
- Track payment deadlines carefully
`;
}

function generateWorkingCapitalAnalysis(basicMetrics: any) {
    const ar = basicMetrics.accountsReceivable || 0;
    const ap = basicMetrics.accountsPayable || 0;
    const workingCapital = ar - ap;
    
    return `
Working Capital Assessment:

Working Capital Position: $${workingCapital.toFixed(2)}

Analysis:
- Current working capital is ${workingCapital > 0 ? 'positive' : 'negative'}
- ${workingCapital > 0 ? 'Company has adequate liquidity' : 'Company needs to improve cash position'}

Recommendations:
- Maintain healthy working capital ratio
- Monitor cash conversion cycle
- Optimize inventory levels if applicable
`;
}

function generateMarginAnalysis(basicMetrics: any) {
    const profitMargin = basicMetrics.profitMargin || 0;
    
    return `
Margin Analysis:

Gross Profit Margin: ${profitMargin.toFixed(2)}%

Industry Benchmarks:
- Excellent: > 25%
- Good: 15-25%
- Fair: 10-15%
- Poor: < 10%

Your Rating: ${profitMargin > 25 ? 'Excellent' : profitMargin > 15 ? 'Good' : profitMargin > 10 ? 'Fair' : 'Poor'}
`;
}

function generateProfitLeakageAnalysis(metrics: any[]) {
    const leakageMetric = metrics.find(m => m.metric_name === 'Profit Leakage Analyzer');
    const data = leakageMetric?.metric_data || {};
    
    return `
Profit Leakage Assessment:

Monthly Leakage: $${(data.monthlyLeakage || 0).toFixed(2)}
Uncategorized Expenses: $${(data.uncategorizedExpenses || 0).toFixed(2)}

Impact: Equivalent to ${data.equivalentEmployees || 0} employee costs

Action Required:
- Properly categorize all expenses
- Review miscellaneous expense accounts
- Implement expense tracking system
`;
}

function generateOptimizationOpportunities(metrics: any[]) {
    const vendorMetric = metrics.find(m => m.metric_name === 'Vendor Payment Optimization');
    const data = vendorMetric?.metric_data || {};
    
    return `
Optimization Opportunities:

Vendor Payment Optimization:
- Early payment opportunities: ${data.earlyPaymentOpportunities || 0}
- Estimated savings potential: $${(data.estimatedSavings || 0).toFixed(2)}
- Opportunity score: ${(data.opportunityScore || 0).toFixed(2)}%

Recommendations:
- Review vendor terms for early payment discounts
- Automate payment scheduling
- Maintain strong vendor relationships
`;
}

function generateRecommendations(basicMetrics: any, metrics: any[]) {
    const profitMargin = basicMetrics.profitMargin || 0;
    
    return `
Strategic Recommendations:

Short-term (Next 30 days):
1. ${profitMargin < 10 ? 'Review and adjust pricing strategy' : 'Maintain current pricing levels'}
2. Implement weekly cash flow monitoring
3. Update financial dashboard with current data

Medium-term (Next 90 days):
1. Develop comprehensive budget for next quarter
2. Implement automated expense tracking
3. Review and optimize vendor contracts

Long-term (6-12 months):
1. Build 3-month cash reserve
2. Implement predictive financial analytics
3. Develop strategic growth plan
4. Consider diversifying revenue streams

Technology Recommendations:
- Automate routine bookkeeping tasks
- Implement real-time financial dashboard
- Use AI for anomaly detection
- Establish regular financial review cadence
`;
}

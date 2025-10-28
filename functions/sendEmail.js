// Cloudflare Pages Function for handling form submissions
// Uses Cloudflare Email Routing

export async function onRequestPost(context) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const data = await context.request.json();

        // Basic spam protection: honeypot
        if (data.website) {
            return new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: corsHeaders
            });
        }

        const to = 'ask@thebalancebarn.cc';

        let subject, html;

        // Handle different form types
        if (data.type === 'assessment') {
            // Assessment form
            const {
                firstName = '',
                lastName = '',
                businessName = '',
                email = '',
                phone = '',
                industry = '',
                businessStructure = '',
                revenue = '',
                services = '',
                currentSetup = '',
                urgency = '',
                message = ''
            } = data;

            if (!firstName || !email) {
                return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            subject = `📋 New Assessment Request from ${firstName} ${lastName}`;
            html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #500000, #732f2f); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #500000; }
        .section h2 { color: #500000; margin-top: 0; font-size: 18px; }
        .field { margin-bottom: 12px; }
        .label { font-weight: 600; color: #500000; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Financial Assessment Request</h1>
        </div>
        <div class="content">
            <div class="section">
                <h2>Contact Information</h2>
                <div class="field"><span class="label">Name:</span> <span class="value">${firstName} ${lastName}</span></div>
                <div class="field"><span class="label">Business:</span> <span class="value">${businessName}</span></div>
                <div class="field"><span class="label">Email:</span> <span class="value">${email}</span></div>
                <div class="field"><span class="label">Phone:</span> <span class="value">${phone}</span></div>
            </div>

            <div class="section">
                <h2>Business Details</h2>
                <div class="field"><span class="label">Industry:</span> <span class="value">${industry}</span></div>
                <div class="field"><span class="label">Structure:</span> <span class="value">${businessStructure}</span></div>
                <div class="field"><span class="label">Annual Revenue:</span> <span class="value">${revenue}</span></div>
            </div>

            <div class="section">
                <h2>Services Requested</h2>
                <div class="field"><span class="value">${services || 'None selected'}</span></div>
            </div>

            <div class="section">
                <h2>Current Situation</h2>
                <div class="field"><span class="label">Software:</span> <span class="value">${currentSetup}</span></div>
                <div class="field"><span class="label">Timeline:</span> <span class="value">${urgency}</span></div>
            </div>

            ${message ? `
            <div class="section">
                <h2>Additional Details</h2>
                <div class="field"><span class="value">${message}</span></div>
            </div>
            ` : ''}

            <div class="footer">
                <p><strong>⏰ Action Required:</strong> Please review and respond within 24 hours.</p>
            </div>
        </div>
    </div>
</body>
</html>
            `;

        } else {
            // Regular contact form
            const {
                fullName = '',
                businessName = '',
                email = '',
                phone = '',
                message = ''
            } = data;

            if (!fullName || !email) {
                return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                    status: 400,
                    headers: corsHeaders
                });
            }

            subject = `New Inquiry from ${fullName}`;
            html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #500000, #732f2f); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #500000; }
        .field { margin-bottom: 12px; }
        .label { font-weight: 600; color: #500000; }
        .value { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💼 New Contact Inquiry</h1>
        </div>
        <div class="content">
            <div class="section">
                <div class="field"><span class="label">Name:</span> <span class="value">${fullName}</span></div>
                <div class="field"><span class="label">Business:</span> <span class="value">${businessName}</span></div>
                <div class="field"><span class="label">Email:</span> <span class="value">${email}</span></div>
                <div class="field"><span class="label">Phone:</span> <span class="value">${phone}</span></div>
            </div>

            <div class="section">
                <div class="field"><span class="label">Message:</span></div>
                <div class="value">${message}</div>
            </div>
        </div>
    </div>
</body>
</html>
            `;
        }

        // Send email using Cloudflare Email Worker
        // Create email message
        const message = {
            from: { email: 'ask@thebalancebarn.cc', name: 'The Balance Barn' },
            to: [{ email: to }],
            subject: subject,
            html: html
        };

        // Set reply-to if submitter provided email
        if (data.email) {
            message.reply_to = { email: data.email };
        }

        // Use Cloudflare's email sending binding
        await context.env.SEND_EMAIL.send(message);

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: corsHeaders
        });

    } catch (err) {
        console.error('Email send failed:', err);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

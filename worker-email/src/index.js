export default {
  /**
   * HTTP endpoint to send email via Cloudflare Send Email binding.
   * POST https://<your-subdomain>.workers.dev/send
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'POST' || url.pathname !== '/send') {
      return new Response('Not Found', { status: 404 });
    }

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    try {
      const data = await request.json();

      // Minimal validation
      const type = data?.type;
      const to = 'ask@thebalancebarn.cc';

      let subject = 'Website Inquiry';
      let html = '';

      if (type === 'assessment') {
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
        } = data || {};

        if (!firstName || !email) {
          return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), { status: 400, headers: cors });
        }

        subject = `📋 New Assessment Request from ${firstName} ${lastName}`;
        html = `
          <h2>Contact Information</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Business:</strong> ${businessName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <h2>Business Details</h2>
          <p><strong>Industry:</strong> ${industry}</p>
          <p><strong>Structure:</strong> ${businessStructure}</p>
          <p><strong>Annual Revenue:</strong> ${revenue}</p>
          <h2>Services Requested</h2>
          <p>${services || 'None selected'}</p>
          <h2>Current Situation</h2>
          <p><strong>Software:</strong> ${currentSetup}</p>
          <p><strong>Timeline:</strong> ${urgency}</p>
          ${message ? `<h2>Additional Details</h2><p>${message}</p>` : ''}
        `;
      } else {
        const { fullName = '', businessName = '', email = '', phone = '', message = '' } = data || {};

        if (!fullName || !email) {
          return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), { status: 400, headers: cors });
        }

        subject = `New Inquiry from ${fullName}`;
        html = `
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Business:</strong> ${businessName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <h3>Message</h3>
          <p>${message}</p>
        `;
      }

      if (!env.SEND_EMAIL) {
        return new Response(JSON.stringify({ ok: false, error: 'Worker SEND_EMAIL binding missing' }), { status: 500, headers: cors });
      }

      const msg = {
        from: { email: 'ask@thebalancebarn.cc', name: 'The Balance Barn' },
        to: [{ email: to }],
        subject,
        html
      };
      if (data?.email) msg.reply_to = { email: data.email };

      await env.SEND_EMAIL.send(msg);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: cors });
    }
  },

  /**
   * Optional: keep email() handler defined so existing Email Routing triggers don’t break.
   */
  async email(message, env, ctx) {
    // No-op; you can implement inbound handling later if needed.
    ctx.waitUntil(Promise.resolve());
  }
};

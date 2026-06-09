import crypto from 'crypto';

const PIXEL_ID = '1250334555460081';
const API_VERSION = 'v18.0';

const sha256 = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const token = process.env.META_CAPI_TOKEN;
    if (!token) return res.status(500).json({ error: 'META_CAPI_TOKEN not configured' });

    try {
        const { event_name, event_id, event_source_url, custom_data, user_data: clientUserData } = req.body || {};

        if (!event_name) return res.status(400).json({ error: 'event_name required' });

        const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const user_data = {
            client_ip_address: ip,
            client_user_agent: userAgent,
            fbp: clientUserData?.fbp,
            fbc: clientUserData?.fbc,
        };
        if (clientUserData?.email) user_data.em = sha256(clientUserData.email);
        if (clientUserData?.phone) user_data.ph = sha256(clientUserData.phone.replace(/\D/g, ''));

        const payload = {
            data: [{
                event_name,
                event_time: Math.floor(Date.now() / 1000),
                event_id,
                event_source_url,
                action_source: 'website',
                user_data,
                custom_data: custom_data || {},
            }],
        };

        const fbRes = await fetch(`https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await fbRes.json();
        if (!fbRes.ok) return res.status(fbRes.status).json({ error: 'meta_api_error', details: data });
        return res.status(200).json({ ok: true, fb: data });
    } catch (err) {
        return res.status(500).json({ error: 'server_error', message: err.message });
    }
}

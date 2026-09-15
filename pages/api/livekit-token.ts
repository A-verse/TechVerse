import type { NextApiRequest, NextApiResponse } from 'next';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';

type ResponseData = {
  server_url?: string;
  participant_token?: string;
  error?: string;
};

const makeIdentity = () => `tv-${crypto.randomUUID()}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !serverUrl) {
    return res.status(503).json({
      error: 'LiveKit is not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET.'
    });
  }

  const roomName = String(req.body?.room_name || '').trim();
  const participantName = String(req.body?.participant_name || 'TechVerse Guest').trim().slice(0, 40);
  const role = req.body?.role === 'viewer' ? 'viewer' : 'speaker';

  if (!roomName) return res.status(400).json({ error: 'A live stage room is required.' });

  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: makeIdentity(),
      name: participantName,
      ttl: '2h'
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: role === 'speaker',
      canSubscribe: true,
      canPublishData: role === 'speaker'
    });

    return res.status(200).json({
      server_url: serverUrl,
      participant_token: await token.toJwt()
    });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return res.status(500).json({ error: 'Unable to create a LiveKit access token.' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';

import { RoomServiceClient, TrackType } from 'livekit-server-sdk';

import { COOKIE } from '@lib/constants';
import { getUserById } from '@lib/db-api';

type ModerateAction = 'mute_audio' | 'mute_video' | 'remove';

type ResponseData = {
  ok?: boolean;
  error?: string;
};

function getModeratorEmails(): string[] {
  return (process.env.LIVEKIT_MODERATOR_EMAILS || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
}

const VALID_ACTIONS: ModerateAction[] = ['mute_audio', 'mute_video', 'remove'];

/**
 * Moderation actions (mute / remove a participant) require server-side
 * RoomServiceClient calls — the LiveKit client SDK cannot force-mute or
 * remove a *different* participant on its own. This endpoint independently
 * re-verifies moderator authorization on every request; it never trusts a
 * role claimed by the caller or implied by an earlier token request.
 */
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

  const userId = req.cookies[COOKIE];

  if (!userId) {
    return res.status(401).json({ error: 'You must log in to moderate the TechVerse live stage.' });
  }

  let user;

  try {
    user = await getUserById(userId);
  } catch (error) {
    console.error('LiveKit moderation authentication failed:', error);
    return res
      .status(401)
      .json({ error: 'Your TechVerse session is invalid. Please log in again.' });
  }

  if (!user?.email) {
    return res
      .status(401)
      .json({ error: 'Your TechVerse account could not be verified. Please log in again.' });
  }

  const moderatorEmails = getModeratorEmails();
  const userEmail = String(user.email).trim().toLowerCase();

  if (!moderatorEmails.includes(userEmail)) {
    return res
      .status(403)
      .json({ error: 'Moderator access is restricted to approved TechVerse accounts.' });
  }

  const roomName = String(req.body?.room_name || '').trim();
  const identity = String(req.body?.identity || '').trim();
  const action = String(req.body?.action || '') as ModerateAction;

  const allowedRooms = [
    process.env.NEXT_PUBLIC_LIVEKIT_ROOM_A,
    process.env.NEXT_PUBLIC_LIVEKIT_ROOM_C,
    process.env.NEXT_PUBLIC_LIVEKIT_ROOM_M
  ].filter((value): value is string => Boolean(value));

  if (!roomName || !allowedRooms.includes(roomName)) {
    return res.status(403).json({ error: 'This LiveKit room is not an active TechVerse stage.' });
  }

  if (!identity) {
    return res.status(400).json({ error: 'A participant identity is required.' });
  }

  if (!VALID_ACTIONS.includes(action)) {
    return res.status(400).json({ error: 'Unsupported moderation action.' });
  }

  const client = new RoomServiceClient(
    serverUrl.replace('wss://', 'https://').replace('ws://', 'http://'),
    apiKey,
    apiSecret
  );

  try {
    if (action === 'remove') {
      await client.removeParticipant(roomName, identity);
      return res.status(200).json({ ok: true });
    }

    const participant = await client.getParticipant(roomName, identity);
    const source = action === 'mute_audio' ? 'Microphone' : 'Camera';
    const wantedType = action === 'mute_audio' ? TrackType.AUDIO : TrackType.VIDEO;
    const track = participant.tracks.find(t => t.type === wantedType);

    if (!track) {
      return res
        .status(404)
        .json({ error: `That participant has no active ${source.toLowerCase()} track.` });
    }

    await client.mutePublishedTrack(roomName, identity, track.sid, true);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('LiveKit moderation action failed:', error);
    return res.status(500).json({ error: 'That moderation action failed. Please try again.' });
  }
}

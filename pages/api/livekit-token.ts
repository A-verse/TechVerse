import type { NextApiRequest, NextApiResponse } from 'next';

import { AccessToken } from 'livekit-server-sdk';

import crypto from 'crypto';

import { COOKIE } from '@lib/constants';
import { getUserById } from '@lib/db-api';

type LiveStageRole = 'viewer' | 'speaker' | 'moderator';

type ResponseData = {
  server_url?: string;
  participant_token?: string;
  role?: LiveStageRole;
  is_moderator?: boolean;
  error?: string;
};

const makeIdentity = () => `tv-${crypto.randomUUID()}`;

function getModeratorEmails(): string[] {
  return (process.env.LIVEKIT_MODERATOR_EMAILS || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  /*
   * Only POST is allowed.
   */
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return res.status(405).json({
      error: 'Method not allowed.'
    });
  }

  /*
   * LiveKit server configuration.
   */
  const apiKey = process.env.LIVEKIT_API_KEY;

  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const serverUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !serverUrl) {
    return res.status(503).json({
      error: 'LiveKit is not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET.'
    });
  }

  /*
   * ------------------------------------------------
   * AUTHENTICATION
   * ------------------------------------------------
   *
   * Every LiveKit participant must be a logged-in
   * TechVerse user.
   */
  const userId = req.cookies[COOKIE];

  if (!userId) {
    return res.status(401).json({
      error: 'You must log in to join the TechVerse live stage.'
    });
  }

  let user;

  try {
    user = await getUserById(userId);
  } catch (error) {
    console.error('LiveKit user authentication failed:', error);

    return res.status(401).json({
      error: 'Your TechVerse session is invalid. Please log in again.'
    });
  }

  if (!user?.email) {
    return res.status(401).json({
      error: 'Your TechVerse account could not be verified. Please log in again.'
    });
  }

  /*
   * ------------------------------------------------
   * REQUEST DATA
   * ------------------------------------------------
   */
  const roomName = String(req.body?.room_name || '').trim();

  const participantName = String(req.body?.participant_name || user.name || 'TechVerse Guest')
    .trim()
    .slice(0, 40);

  const requestedRole = String(req.body?.role || 'viewer');

  const role: LiveStageRole =
    requestedRole === 'moderator'
      ? 'moderator'
      : requestedRole === 'speaker'
        ? 'speaker'
        : 'viewer';

  if (!roomName) {
    return res.status(400).json({
      error: 'A live stage room is required.'
    });
  }

  const allowedRooms = [
    process.env.NEXT_PUBLIC_LIVEKIT_ROOM_A,
    process.env.NEXT_PUBLIC_LIVEKIT_ROOM_C,
    process.env.NEXT_PUBLIC_LIVEKIT_ROOM_M
  ].filter((value): value is string => Boolean(value));

  if (!allowedRooms.includes(roomName)) {
    return res.status(403).json({
      error: 'This LiveKit room is not an active TechVerse stage.'
    });
  }

  try {
    /*
     * ------------------------------------------------
     * MODERATOR AUTHORIZATION
     * ------------------------------------------------
     */
    let isModerator = false;

    if (role === 'moderator') {
      const moderatorEmails = getModeratorEmails();

      const userEmail = String(user.email).trim().toLowerCase();

      isModerator = moderatorEmails.includes(userEmail);

      if (!isModerator) {
        return res.status(403).json({
          error: 'Moderator access is restricted to approved TechVerse accounts.'
        });
      }
    }

    /*
     * ------------------------------------------------
     * LIVEKIT PERMISSIONS
     * ------------------------------------------------
     */

    const canPublish = role === 'speaker' || role === 'moderator';

    const token = new AccessToken(apiKey, apiSecret, {
      /*
       * Use an opaque server-generated identity.
       */
      identity: makeIdentity(),

      /*
       * Use the registered user's name.
       */
      name: participantName || 'TechVerse Guest',

      /*
       * Token expires after 2 hours.
       */
      ttl: '2h'
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,

      /*
       * Viewer:
       * false
       *
       * Speaker:
       * true
       *
       * Moderator:
       * true
       */
      canPublish,

      /*
       * Everyone can watch/subscribe.
       */
      canSubscribe: true,

      /*
       * Everyone — including viewers — can publish data (chat, Q&A).
       * This is intentionally independent from `canPublish`, which only
       * governs camera/microphone. Without this, viewers would see a
       * chat box they could never actually send a message from.
       */
      canPublishData: true,

      /*
       * Moderator gets room administration
       * permissions.
       */
      ...(isModerator
        ? {
            roomAdmin: true
          }
        : {})
    });

    const participantToken = await token.toJwt();

    return res.status(200).json({
      server_url: serverUrl,
      participant_token: participantToken,
      role,
      is_moderator: isModerator
    });
  } catch (error) {
    console.error('LiveKit token error:', error);

    return res.status(500).json({
      error: 'Unable to create a LiveKit access token.'
    });
  }
}

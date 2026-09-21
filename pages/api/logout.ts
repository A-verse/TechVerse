import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

import { COOKIE } from '@lib/constants';

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res
      .status(405)
      .json({ error: { code: 'method_not_allowed', message: 'Only POST is allowed' } });
  }

  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: -1
    })
  );

  return res.status(200).json({ ok: true });
}

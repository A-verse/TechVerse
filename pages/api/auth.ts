import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE } from '@lib/constants';
import { getTicketNumberByUserId } from '@lib/db-api';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'method_not_allowed', message: 'Only GET is allowed' } });
  }

  const id = req.cookies[COOKIE];
  if (!id) {
    return res.status(401).json({
      error: { code: 'missing_cookie', message: 'Missing authentication cookie' }
    });
  }

  try {
    const ticketNumber = await getTicketNumberByUserId(id);
    if (!ticketNumber) {
      return res.status(401).json({
        error: { code: 'not_registered', message: 'This user is not registered' }
      });
    }
    return res.status(200).json({ loggedIn: true });
  } catch (error) {
    console.error('Auth check failed:', error);
    return res.status(500).json({
      error: { code: 'server_error', message: 'Unable to verify registration' }
    });
  }
}

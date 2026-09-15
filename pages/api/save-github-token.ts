/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getTicketNumberByUserId, updateUserWithGitHubUser } from '@lib/db-api';
import { COOKIE } from '@lib/constants';

export default async function saveGithubToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST'
      }
    });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const id = req.cookies[COOKIE];
  const token = typeof body.token === 'string' ? body.token : '';

  if (!id || !token) {
    return res.status(400).json({
      error: {
        code: 'bad_input',
        message: 'Invalid parameters'
      }
    });
  }

  try {
    const ticketNumber = await getTicketNumberByUserId(id);
    if (!ticketNumber) {
      return res.status(404).json({ error: { code: 'invalid_id', message: 'The registration does not exist' } });
    }

    const { username, name } = await updateUserWithGitHubUser(id, token);
    return res.status(200).json({ username, name });
  } catch (error) {
    console.error('GitHub profile update failed:', error);
    return res.status(500).json({
      error: { code: 'server_error', message: 'Unable to update your ticket' }
    });
  }
}

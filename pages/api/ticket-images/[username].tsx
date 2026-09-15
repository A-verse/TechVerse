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
import screenshot from '@lib/screenshot';
import { SITE_URL, SAMPLE_TICKET_NUMBER } from '@lib/constants';
import { getUserByUsername } from '@lib/db-api';

export default async function ticketImages(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  const username = req.query?.username?.toString();
  if (!username) return res.status(404).send('Not Found');

  try {
    const user = await getUserByUsername(username);
    if (!user.ticketNumber) return res.status(404).send('Not Found');

    const ticketNumber = user.ticketNumber;
    let url = `${SITE_URL}/ticket-image?username=${encodeURIComponent(
      username
    )}&ticketNumber=${encodeURIComponent(ticketNumber)}`;

    if (user.name) {
      url += `&name=${encodeURIComponent(user.name)}`;
    }

    const file = await screenshot(url);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    );
    return res.status(200).send(file);
  } catch (error) {
    console.error('Ticket image generation failed:', error);
    return res.status(500).send('Unable to generate ticket image');
  }
}

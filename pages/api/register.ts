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
import { ConfUser } from '@lib/types';
import validator from 'validator';
import { COOKIE } from '@lib/constants';
import cookie from 'cookie';
import ms from 'ms';
import { getTicketNumberByUserId, getUserById, createUser } from '@lib/db-api';
import { emailToId } from '@lib/user-api';
import { validateCaptchaResult, IS_CAPTCHA_ENABLED } from '@lib/captcha';

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse<ConfUser | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: { code: 'method_not_allowed', message: 'This endpoint only responds to POST' }
    });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const token = typeof body.token === 'string' ? body.token : '';

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: { code: 'bad_email', message: 'Please enter a valid email address' }
    });
  }

  try {
    if (IS_CAPTCHA_ENABLED) {
      const isCaptchaValid = await validateCaptchaResult(token);
      if (!isCaptchaValid) {
        return res.status(400).json({
          error: { code: 'bad_captcha', message: 'Captcha validation failed' }
        });
      }
    }

    const id = emailToId(email);
    const existingTicketNumberString = await getTicketNumberByUserId(id);

    let ticketNumber: number;
    let createdAt = Date.now();
    let statusCode = 200;
    let name: string | null | undefined;
    let username: string | null | undefined;

    if (existingTicketNumberString) {
      const user = await getUserById(id);
      name = user.name;
      username = user.username;
      ticketNumber = parseInt(existingTicketNumberString, 10);
      createdAt = user.createdAt ?? createdAt;
    } else {
      const newUser = await createUser(id, email);
      ticketNumber = newUser.ticketNumber ?? 0;
      createdAt = newUser.createdAt ?? createdAt;
      statusCode = 201;
    }

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(COOKIE, id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    );

    return res.status(statusCode).json({
      id,
      email,
      ticketNumber,
      createdAt,
      name,
      username
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({
      error: { code: 'server_error', message: 'Registration is temporarily unavailable' }
    });
  }
}

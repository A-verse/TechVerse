import crypto from 'crypto';

export async function register(email: string, token?: string) {
  return fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token })
  });
}

export async function saveGithubToken({ token }: { id?: string; token: string }) {
  return fetch('/api/save-github-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
}

export function emailToId(email: string) {
  const secret = process.env.EMAIL_TO_ID_SECRET;
  const hmac = crypto.createHmac('sha256', secret || 'techverse-development-key');
  return hmac.update(email).digest('hex');
}

export const getToken = async (role: string, roomId: string): Promise<string> => {
  const endpoint = process.env.NEXT_PUBLIC_HMS_TOKEN_ENDPOINT;
  if (!endpoint) throw new Error('Live stage is not configured.');
  const response = await fetch(`${endpoint.replace(/\/$/, '')}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, room_id: roomId })
  });
  if (!response.ok) throw new Error(`Token service returned ${response.status}`);
  const data = await response.json();
  if (!data.token) throw new Error('Token service returned no token.');
  return data.token;
};

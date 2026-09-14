export async function validateCaptchaResult(result: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret || !result) return false;

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: result }).toString()
    });

    if (!response.ok) return false;
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error('hCaptcha validation failed:', error);
    return false;
  }
}

export const IS_CAPTCHA_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && process.env.HCAPTCHA_SECRET_KEY
);

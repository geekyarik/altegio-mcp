import axios from 'axios';

let userToken: string | null = null;

export async function authenticate(): Promise<string> {
  const res = await axios.post(
    'https://api.alteg.io/api/v1/auth',
    { login: process.env.ALTEGIO_USER_LOGIN, password: process.env.ALTEGIO_USER_PASSWORD },
    { headers: { Authorization: `Bearer ${process.env.ALTEGIO_PARTNER_TOKEN}`, Accept: 'application/vnd.api.v2+json' } }
  );
  userToken = res.data.data.user_token as string;
  return userToken;
}

export function getUserToken(): string {
  if (!userToken) throw new Error('Not authenticated');
  return userToken;
}

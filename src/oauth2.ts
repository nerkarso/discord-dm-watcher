/**
 * Example of using Discord OAuth2
 */

const sessionStore = new Map<string, string>();

const OAUTH2_CLIENT_ID = Bun.env.OAUTH2_CLIENT_ID || '';
const OAUTH2_CLIENT_SECRET = Bun.env.OAUTH2_CLIENT_SECRET || '';
const OAUTH2_REDIRECT_URI = Bun.env.OAUTH2_REDIRECT_URI || '';

export const routes: Record<string, (req: Request) => Promise<Response>> = {
  '/oauth2/login': async () => {
    const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${OAUTH2_CLIENT_ID}&response_type=code&redirect_uri=${OAUTH2_REDIRECT_URI}&scope=identify+messages.read`;
    return new Response(null, { status: 302, headers: { Location: discordAuthURL } });
  },

  '/oauth2/callback': async (req) => {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const errorDescription = url.searchParams.get('error_description');

    if (!!errorDescription) return new Response(`Error: ${errorDescription}`, { status: 400 });
    if (!code) return new Response('No code received!', { status: 400 });

    try {
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: OAUTH2_CLIENT_ID,
          client_secret: OAUTH2_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: OAUTH2_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) throw new Error('Failed to get token');

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      sessionStore.set('accessToken', accessToken);

      return await getUser(accessToken);
    } catch (error) {
      console.error(error);
      return new Response('Error logging in.', { status: 500 });
    }
  },

  '/oauth2/me': async () => {
    const accessToken = sessionStore.get('accessToken');
    if (!accessToken) return new Response('Not logged in!', { status: 401 });

    try {
      return await getUser(accessToken);
    } catch (error) {
      console.error(error);
      return new Response('Error logging in.', { status: 500 });
    }
  },
};

async function getUser(accessToken: string) {
  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userResponse.ok) throw new Error('Failed to fetch user');

  const userData = await userResponse.json();
  return new Response(`Logged in as ${userData.username}`, { status: 200 });
}

import { consola } from 'consola';
import { Client } from 'discord.js-selfbot-v13';
import { dmStore } from './config';

const client = new Client();

client.on('ready', () => {
  consola.box(`Logged in as ${client.user?.username}`);
});

client.on('messageCreate', async (message) => {
  if (!client.user) return;

  // Ignore bots
  if (message.author.bot) return;

  // Only listen for DMs
  if (message.channel.type !== 'DM') return;

  const clientRateLimitKey = client.user.username;
  const clientRateLimitDuration = parseInt(Bun.env.CLIENT_RATE_LIMIT_DURATION || '900') * 1000; // 15 min
  const clientLastSent = dmStore.get(clientRateLimitKey);

  // Check if message is from the client
  // Do nothing
  if (message.author.id === client.user.id) {
    dmStore.set(clientRateLimitKey, Date.now());
    return;
  }

  // Check if client has send a message in the last 15 min
  // This means the client is online
  if (clientLastSent) {
    const clientLastSentDuration = Date.now() - clientLastSent;
    if (clientLastSentDuration <= clientRateLimitDuration) {
      const clientLastSentAt = Math.ceil(clientLastSentDuration / (60 * 1000));
      consola.info(`[RATE_LIMITED] Client (${clientRateLimitKey}) last sent ${clientLastSentAt} min(s) ago`);
      return;
    }
  }

  const senderRateLimitKey = message.author.username;
  const senderRateLimitDuration = parseInt(Bun.env.SENDER_RATE_LIMIT_DURATION || '900') * 1000; // 15 min
  const senderLastSent = dmStore.get(senderRateLimitKey);

  // Check if the sender has already send a message or sent within the rate limit duration
  if (senderLastSent) {
    const senderLastSentDuration = Date.now() - senderLastSent;
    if (senderLastSentDuration <= senderRateLimitDuration) {
      const senderLastSentAt = Math.ceil(senderLastSentDuration / (60 * 1000));
      consola.info(`[RATE_LIMITED] Sender (${senderRateLimitKey}) last sent ${senderLastSentAt} min(s) ago`);
      return;
    }
  }

  try {
    const response = await fetch(Bun.env.NTFY_URL!, {
      method: 'POST',
      headers: {
        Icon:
          Bun.env.NTFY_ICON ||
          message.author.avatarURL({ format: 'png', size: 128 }) ||
          'https://img.icons8.com/?size=192&id=M725CLW4L7wE&format=png',
        Tags: 'speech_balloon',
        Click: message.url,
        Actions: `view, Open Message, ${message.url}`,
      },
      body: `${message.author.displayName}: ${message.cleanContent}`,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to send notification');
    }
    const data = await response.json();
    consola.success(`Notification sent | ${data.id}`);

    dmStore.set(senderRateLimitKey, Date.now());
  } catch (error: any) {
    consola.error(error.message);
  }
});

try {
  await client.login(Bun.env.DISCORD_ACCESS_TOKEN);
} catch (error: any) {
  consola.error(error.message);
}

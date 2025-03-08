import { consola } from 'consola';
import { Client } from 'discord.js-selfbot-v13';

const sessionStore = new Map<string, any>();

const client = new Client();

client.on('ready', () => {
  consola.box(`Logged in as ${client?.user?.username}`);
});

client.on('messageCreate', async (message) => {
  if (message.channel.type === 'DM' && !message.author.bot) {
    try {
      const rateLimitKey = `dm_${message.author.id}`;
      const rateLimitDuration = parseInt(Bun.env.RATE_LIMIT_DURATION || '900') * 1000;
      const lastSent = sessionStore.get(rateLimitKey);
      const currentTime = Date.now();

      if (!lastSent || currentTime - lastSent >= rateLimitDuration) {
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
        consola.success('Notification sent |', data);

        sessionStore.set(rateLimitKey, currentTime);
      } else {
        consola.info('Rate limit applied, notification not sent');
      }
    } catch (error: any) {
      consola.error(error.message);
    }
  }
});

try {
  await client.login(Bun.env.DISCORD_ACCESS_TOKEN);
} catch (error: any) {
  consola.error(error.message);
}
